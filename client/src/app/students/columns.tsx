"use client";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type Student = {
  _id: string;
  email: string;
  name: string;
  age: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const formSchema = z.object({
  age: z
    .number()
    .int()
    .min(0, {
      message: "Age should be greater than or equal to 0.",
    })
    .max(100, {
      message: "Age should be less than or equal to 100.",
    }),
});

export const getColumns = (
  getData: () => Promise<void>
): ColumnDef<Student>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "_id",
      header: () => <div>Id</div>,
      cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    },

    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div>Email</div>,
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "age",
      header: () => <div>Age</div>,
      cell: ({ row }) => <div>{row.getValue("age")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Enrolled Date
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {format(row.getValue("createdAt"), "MMM d, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
        });
        const student = row.original;
        const deleteStudent = async (id: string) => {
          try {
            const response = await fetch(`http://localhost:3000/users/${id}`, {
              method: "DELETE",
              credentials: "include",
            });

            if (response.status !== 200) {
              toast.error("Couldn't delete student");
              return;
            }

            toast.success("Student deleted successfully");
            await getData();
          } catch (error) {
            console.log(error);
          }
        };

        const updateStudent = async (values: z.infer<typeof formSchema>) => {
          const response = await fetch(
            `http://localhost:3000/users/${student._id}/`,
            {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({}),
            }
          );

          const data = await response.json();

          if (response.status === 400) {
            console.log(data);

            data.details.forEach((error: any) => {
              toast.error(error.message);
            });

            return;
          }

          toast.success(data.message);
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(student._id)}
              >
                Copy student ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem aria-hidden={false}>
                <Dialog>
                  <DialogTrigger asChild>
                    <div onClick={(e) => e.stopPropagation()}>Edit</div>
                  </DialogTrigger>
                  <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                      <DialogTitle>Edit student</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(updateStudent)}
                        className="flex py-5 gap-5"
                      >
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={student.age.toString()}
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit">Done</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </DropdownMenuItem>

              <DropdownMenuItem aria-hidden={false}>
                <AlertDialog>
                  <AlertDialogTrigger onClick={(e) => e.stopPropagation()}>
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the student.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteStudent(student._id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
