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
  signIn: (email: string, password: string) => Promise<void>;
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
      signIn: async (email, password) => {
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
