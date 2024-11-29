"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginDto } from "@/types/auth.types";

export async function getCurrentUser(token: string) {
  const currentUserResponse = await fetch(
    `${process.env.OLD_ROSZTI_API_URL}/auth/current`,
    {
      next: { tags: ["/auth/current"], revalidate: 120 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const currentUser = await currentUserResponse.json();

  if (!currentUser) {
    throw new Error("No User Found");
  }

  return currentUser;
}

export async function login(dto: LoginDto) {
  const loginResponse = await fetch(
    `${process.env.OLD_ROSZTI_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    }
  );

  if (!loginResponse.ok) {
    throw new Error("Login Failed");
  }

  const accessToken = await loginResponse.json();

  if (!accessToken) {
    throw new Error("No Access Token Found");
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken.access_token, {
    maxAge: 1000 * 60 * 60 * 2,
  });

  await getCurrentUser(accessToken.access_token);

  revalidatePath("/", "layout");
  redirect("/");
}

export default async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  revalidatePath("/", "layout");
  revalidateTag("/auth/current");
  redirect("/dashboard/login");
}
