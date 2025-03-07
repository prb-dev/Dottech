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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/_zustand/stores/userStore";
import { toast } from "sonner";

export type Subject = {
  id: string;
  name: string;
  mark: number;
};

const formSchema = z.object({
  marks: z
    .number()
    .int()
    .min(0, {
      message: "Marks should be greater than or equal to 0.",
    })
    .max(100, {
      message: "Marks should be less than or equal to 100.",
    }),
});

export const getColumns = (
  getData: (id: string) => void
): ColumnDef<Subject>[] => {
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
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "mark",
      header: ({ column }) => {
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Mark
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">{row.getValue("mark")}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
        });
        const subject = row.original;
        const id = useUserStore((state) => state.id);

        const onSubmit = async (values: z.infer<typeof formSchema>) => {
          const response = await fetch(
            `http://localhost:3000/users/${id}/marks/${subject.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                marks: [
                  {
                    subjectId: subject.id,
                    mark: values.marks,
                  },
                ],
              }),
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
          await getData(id ?? "");
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
                onClick={() => navigator.clipboard.writeText(subject.id)}
              >
                Copy subject ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem aria-hidden={false}>
                <Dialog>
                  <DialogTrigger asChild>
                    <div onClick={(e) => e.stopPropagation()}>Edit mark</div>
                  </DialogTrigger>
                  <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                      <DialogTitle>Edit marks</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex py-5 gap-5"
                      >
                        <FormField
                          control={form.control}
                          name="marks"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={subject.mark.toString()}
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
