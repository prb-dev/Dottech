"use client";
import * as React from "react";
import { Subject, columns } from "./columns";
import { DataTable } from "./data-table";
import { useUserStore } from "@/_zustand/stores/userStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Marks = () => {
  const router = useRouter();
  const signout = useUserStore((state) => state.signOut);
  const id = useUserStore((state) => state.id);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  React.useEffect(() => {
    if (!id) return;

    const getData = async (id: string | null) => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${id}/marks`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.status !== 200) {
          if (response.status === 401) {
            signout(() => router.push("/auth/signin"));
          }
          toast.error("Couldn't retrieve marks");
          return;
        }

        const subjects: Subject[] = data.marks.subjects.map(
          (subject: { _id: string; name: string; marks: number }) => ({
            id: subject._id,
            name: subject.name,
            mark: subject.marks,
          })
        );

        setSubjects(subjects);
      } catch (error) {
        console.log(error);
      }
    };

    getData(id);
  }, [id]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <DataTable columns={columns} data={subjects} />
      </div>
    </div>
  );
};

export default Marks;
