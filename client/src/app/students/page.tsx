"use client";
import * as React from "react";
import { Student, getColumns } from "./columns";
import { DataTable } from "./data-table";
import { toast } from "sonner";

const students = () => {
  const [students, setStudents] = React.useState<Student[]>([]);

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status !== 200) {
        toast.error("Couldn't retrieve students");
        return;
      }

      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const columns = getColumns(getData);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <DataTable columns={columns} data={students} />
      </div>
    </div>
  );
};

export default students;
