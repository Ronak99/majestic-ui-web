"use client";

import { useEffect, useState } from "react";
import { getUser, signInWithGithub } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

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
      <div className="flex items-center gap-2">
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="User avatar"
            className="h-8 w-8 rounded-full"
          />
        )}
        <p className="text-sm">{user.user_metadata?.user_name}</p>
      </div>
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
