"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export default function AuthButton() {
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  if (user) {
    return (
      <Popover onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div
            className={`rounded-md h-full pl-4 pr-8 py-2 hover:bg-zinc-900 transition-colors duration-300 ${
              isOpen ? "bg-zinc-900" : "bg-transparent"
            }`}
          >
            <div className="flex items-center gap-2">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User avatar"
                  className="h-[25px] w-[25px] rounded-full"
                />
              )}
              <p className="font-semibold text-sm">
                {user.user_metadata?.user_name}
              </p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-zinc-900 p-0 mr-4 rounded-sm w-[200px]">
          <div className="border-b p-3">
            <p className="text-sm font-bold">
              {user?.user_metadata?.full_name}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="">
            {/* <Link href="/settings/profile">
            <PopoverClose className="w-full">
              <p className="text-xs py-2 px-2 rounded hover:bg-black cursor-pointer font-medium text-neutral-400 text-left">
                Your Profile
              </p>
            </PopoverClose>
          </Link> */}

            <p
              onClick={signOut}
              className="text-sm p-3 transition duration-300 font-semibold rounded hover:bg-[#0a0a0a] cursor-pointer hover:text-white font-medium text-muted-foreground text-left"
            >
              Sign Out
            </p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return <></>;
}
