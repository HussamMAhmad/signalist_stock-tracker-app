"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import NavItems from "./navitems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { signOut } from "@/lib/actions/auth.actions";

function Dropdown({ user }: { user: User }) {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-3 hover:text-yellow-500">
          <Avatar className="h-8 w-8 ">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="grayscale"
            />
            <AvatarFallback className="text-sm font-bold bg-yellow-500 text-yellow-900">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start font-medium text-gray-400">
            {user.name}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400 w-full" align="center">
        <DropdownMenuLabel>
          <div className="flex gap-3 items-center py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="grayscale"
              />
              <AvatarFallback className="text-sm font-bold bg-yellow-500 text-yellow-900">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start font-medium text-gray-400">
              <div className="text-base">{user.name}</div>
              <div className="text-sm">{user.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          className="text-gray-100 text-md flex items-center"
          onClick={handleSignOut}
        >
          <LogOutIcon className="h-4 w-4" />
          <span>LogOut</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-600 md:hidden block" />
        <nav className="md:hidden block">
          <NavItems />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Dropdown;
