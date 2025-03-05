import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { setCookie } from "cookies-next/client";

type userStore = {
  signedIn: boolean | null;
  id: string | null;
  email: string | null;
  name: string | null;
  age: number | null;
  role: string | null;
  image: string | null;
  signUp: (
    email: string,
    password: string,
    name: string,
    age: number,
    redirect: () => void
  ) => Promise<void>;
  signIn: (email: string, password: string, redirect: () => void) => void;
  signOut: () => void;
  updateUser: (
    id: string,
    values: {
      email?: string;
      name?: string;
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
      name: null,
      age: null,
      role: null,
      image: null,
      signUp: async (email, password, name, age, redirect) => {},
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
            name: data.user.name,
            age: data.user.age,
            role: data.user.role,
            image: data.user.image,
          });

          redirect();
        } catch (error) {
          console.log(error);
        }
      },
      signOut: () => {},
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
            name: data.user.name,
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
