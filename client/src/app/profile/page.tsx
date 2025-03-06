"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/_zustand/stores/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

const formSchema = z.object({
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Email must be valid.",
    }),
  firstName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message: "First name must be at least 3 characters.",
    }),
  lastName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message: "Last name must be at least 3 characters.",
    }),
  age: z
    .number()
    .int()
    .optional()
    .refine((val) => !val || (val > 18 && val < 100), {
      message: "Age must be greater than 18 and less than 100.",
    }),
});

const Profile = () => {
  const updateUser = useUserStore((state) => state.updateUser);
  const email = useUserStore((state) => state.email);
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const age = useUserStore((state) => state.age);
  const image = useUserStore((state) => state.image);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      age: undefined,
    },
  });

  const updateImage = async (url: string) => {
    try {
      await updateUser(useUserStore.getState().id ?? "", { image: url });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { email, firstName, lastName, age } = values;

      if (!email && !firstName && !lastName && !age) return;

      await updateUser(useUserStore.getState().id ?? "", values);

      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <div className="w-1/2 space-y-5">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Your Details
        </h3>

        <div className="flex items-center gap-5">
          <Avatar className="w-40 h-40">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CldUploadWidget
            uploadPreset="ml_default"
            onSuccess={({ event, info }) => {
              if (event === "success") {
                updateImage((info as CloudinaryUploadWidgetInfo)?.url);
              }
            }}
          >
            {({ open }) => <Button onClick={() => open()}>Upload image</Button>}
          </CldUploadWidget>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={email || ""}
                      type="email"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>This is your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={firstName || ""}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={lastName || ""}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={age ? `${age}` : undefined}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>This is your age.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="self-end">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
