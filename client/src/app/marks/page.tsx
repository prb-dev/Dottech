"use client";
import * as React from "react";
import { Subject, getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useUserStore } from "@/_zustand/stores/userStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Marks = () => {
  const router = useRouter();
  const signout = useUserStore((state) => state.signOut);
  const id = useUserStore((state) => state.id);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  const getData = (id: string | null) => {
    fetch(`http://localhost:3000/users/${id}/marks`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.status !== 200) {
          if (response.status === 401) {
            signout(() => router.push("/auth/signin"));
          }
          toast.error("Couldn't retrieve marks");
          return;
        }
        return response.json();
      })
      .then((data) => {
        const subjects: Subject[] = data.marks.subjects.map(
          (subject: { _id: string; name: string; marks: number }) => ({
            id: subject._id,
            name: subject.name,
            mark: subject.marks,
          })
        );

        setSubjects(subjects);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (!id) return;

    getData(id);
  }, [id]);

  const columns = getColumns(getData);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <DataTable columns={columns} data={subjects} />
      </div>
    </div>
  );
};

export default Marks;
