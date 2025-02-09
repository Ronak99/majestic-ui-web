import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { createUser } from "@/actions/user";
import { useAuthStore } from "@/store/useAuthStore";

export const useAuthInitializer = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    initialize();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await createUser(session.user);
      }
      useAuthStore.setState({ user: session?.user ?? null });
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [initialize]);
};
