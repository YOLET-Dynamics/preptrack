"use server";

import { cookies } from "next/headers";

export async function clearAccessToken() {
  const cookieStore = await cookies();

  cookieStore.delete({
    name: "access_token",
    path: "/",
    domain: ".preptrack.app",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  return;
}
