import * as React from "react";

import { Subject, columns } from "./columns";
import { DataTable } from "./data-table";

const data: Subject[] = [
  {
    id: "m5gr84i9",
    name: "dsfds",
    mark: 316,
  },
  {
    id: "3u1reuv4",
    name: "qwer",
    mark: 242,
  },
  {
    id: "derv1ws0",
    name: "ikn",
    mark: 837,
  },
  {
    id: "5kma53ae",
    name: "zzzzzz",
    mark: 874,
  },
  {
    id: "bhqecj4p",
    name: "nnnnn",
    mark: 721,
  },
];

async function getData(): Promise<Subject[]> {
  // Fetch data from your API here.
  return data;
}

const Marks = async () => {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Marks;
