import { NextResponse, type NextRequest } from "next/server";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";

export const middleware = async (request: NextRequest) => {
  const signedIn = (await getCookie("signedIn", { cookies })) === "true";

  if (!signedIn)
    return NextResponse.redirect(new URL("/auth/signin", request.url));

  return NextResponse.next();
};

export const config = {
  matcher: ["/marks", "/profile", "/"],
};
