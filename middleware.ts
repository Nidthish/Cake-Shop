import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];

  // Canonical apex to www 301 redirect for lollipopcakeshop.in
  if (host === "lollipopcakeshop.in") {
    const url = req.nextUrl.clone();
    url.host = "www.lollipopcakeshop.in";
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();

  // Set OWASP Recommended Defense HTTP Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|manifest.json|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
