import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { deleteCookie, setCookie } from "cookies-next/client";

type userStore = {
  signedIn: boolean | null;
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  role: string | null;
  image: string | null;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number,
    role: string,
    redirect: () => void
  ) => Promise<void>;
  signIn: (
    email: string,
    password: string,
    redirect: () => void
  ) => Promise<void>;
  signOut: (redirect: () => void) => Promise<void>;
  updateUser: (
    id: string,
    values: {
      email?: string;
      firstName?: string;
      lastName?: string;
      age?: number;
      image?: string;
    }
  ) => Promise<void>;
};

export const useUserStore = create<userStore>()(
  persist(
    (set) => ({
      signedIn: null,
      id: null,
      email: null,
      firstName: null,
      lastName: null,
      age: null,
      role: null,
      image: null,
      signUp: async (
        email,
        password,
        firstName,
        lastName,
        age,
        role,
        redirect
      ) => {
        try {
          const response = await fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email,
              password,
              firstName,
              lastName,
              age,
              role,
            }),
          });

          const data = await response.json();

          if (response.status !== 201) {
            toast.error("Couldn't create account");
            return;
          }

          toast.success(data.message);
          redirect();
        } catch (error) {
          console.log(error);
        }
      },
      signIn: async (email, password, redirect) => {
        try {
          const response = await fetch("http://localhost:3000/auth/signin", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email,
              password,
            }),
          });

          const data = await response.json();

          if (response.status !== 200) {
            setCookie("signedIn", false, {
              maxAge: 24 * 60 * 60,
            });
            set({
              signedIn: false,
            });
            toast.error(data.message);
            return;
          }

          setCookie("signedIn", true, {
            maxAge: 24 * 60 * 60,
          });

          set({
            signedIn: true,
            id: data.user._id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            age: data.user.age,
            role: data.user.role,
            image: data.user.image,
          });

          redirect();
        } catch (error) {
          console.log(error);
        }
      },
      signOut: async (redirect) => {
        try {
          await fetch(`http://localhost:3000/auth/signout`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
          });

          deleteCookie("signedIn");

          set({
            signedIn: false,
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            age: null,
            role: null,
            image: null,
          });

          redirect();
        } catch (error) {
          console.log(error);
        }
      },
      updateUser: async (id, values) => {
        try {
          const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              ...values,
            }),
          });

          const data = await response.json();

          if (response.status !== 200) {
            toast.error(data.message);
            return;
          }

          set({
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            age: data.user.age,
            image: data.user.image,
          });

          toast.success("User updated successfully");
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      name: "userStore",
    }
  )
);
