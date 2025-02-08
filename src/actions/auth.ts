import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { createUser } from "./user";

export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });

  if (error) {
    return;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  console.error(error);
}

export const getUser = async (): Promise<User | null> => {
  const user = await supabase.auth.getUser();
  return user.data.user;
};
