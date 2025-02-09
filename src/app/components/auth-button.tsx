"use client";

import { useEffect, useState } from "react";
import { getUser, signInWithGithub, signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { createUser } from "@/actions/user";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthButton() {
  const { user, signIn } = useAuthStore();

  if (user) {
    return (
      <Button
        variant={"ghost"}
        className="rounded-md h-full"
        onClick={() => {
          signOut();
        }}
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
      </Button>
    );
  }

  return <></>;
}
