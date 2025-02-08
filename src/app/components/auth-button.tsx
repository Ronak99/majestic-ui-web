"use client";

import { useEffect, useState } from "react";
import { getUser, signInWithGithub, signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { createUser } from "@/actions/user";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUser = async () => {
      try {
        const supabaseUser = await getUser();
        setUser(supabaseUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        createUser(session?.user);
      }
      setUser(session?.user ?? null);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <></>;
  }

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

  return (
    <Button
      onClick={() => {
        signInWithGithub();
      }}
    >
      Sign In with GitHub
    </Button>
  );
}
