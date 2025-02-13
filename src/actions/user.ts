"use server";

import { db } from "@/lib/db";
import { User } from "@supabase/supabase-js";

export async function createUser(user: User) {
  const existingUser = await db.users.findUnique({
    where: { email: user.email ?? "" },
  });

  if (existingUser) return;

  await db.users.create({
    data: {
      email: user.email ?? "",
      uid: user.id,
      name: user.user_metadata.name,
      username: user.user_metadata.user_name,
      avatar: user.user_metadata.avatar_url,
    },
  });
}
