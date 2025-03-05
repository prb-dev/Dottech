"use client";
import * as React from "react";
import { Subject, columns } from "./columns";
import { DataTable } from "./data-table";
import { useUserStore } from "@/_zustand/stores/userStore";
import { toast } from "sonner";

const Marks = () => {
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
