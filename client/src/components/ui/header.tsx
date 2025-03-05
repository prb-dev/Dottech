"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/_zustand/stores/userStore";

const Header = () => {
  const role = useUserStore((state) => state.role);
  const signedIn = useUserStore((state) => state.signedIn);
  const image = useUserStore((state) => state.image);
  return signedIn ? (
    <div className="flex justify-end p-5">
      <NavigationMenu>
        <NavigationMenuList className="space-x-5">
          {role === "teacher" && (
            <NavigationMenuItem>
              <Link href="/students" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Students
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}

          {role === "student" && (
            <NavigationMenuItem>
              <Link href="/marks" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Marks
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={image ?? undefined} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/profile" legacyBehavior passHref>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Signout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ) : (
    <></>
  );
};

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
