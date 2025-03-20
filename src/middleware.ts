import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 개발 환경과 프로덕션 환경 구분
  const host = request.headers.get("host") || "";
  const isDev = host.includes("localhost") || host.includes("127.0.0.1");
  const isProd = !isDev;

  // 각 요청마다 고유한 nonce 생성 (Web Crypto API 사용)
  // 16바이트 랜덤 값을 16진수 문자열로 변환
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 응답 객체 생성
  const response = NextResponse.next();

  // nonce 값을 응답 헤더에 추가 (클라이언트에서 접근 가능하도록)
  response.headers.set("x-nonce", nonce);

  // 개발 환경과 프로덕션 환경에 따라 다른 CSP 정책 설정
  let scriptSrc = `'self' 'nonce-${nonce}' https://accounts.google.com https://connect.facebook.net`;

  // 개발 환경에서는 'unsafe-eval' 허용 (Next.js 개발 모드에 필요)
  if (isDev) {
    scriptSrc += " 'unsafe-eval'";
  }

  // CSP 헤더 설정
  const cspHeader = `
    default-src 'self' https://accounts.google.com https://connect.facebook.net;
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://accounts.google.com;
    img-src 'self' data: blob:;
    font-src 'self';
    connect-src 'self' https://accounts.google.com https://accounts.idp.example; 
    frame-src 'self' https://accounts.google.com;
    form-action 'self';
    base-uri 'self';
    object-src 'none';
  `
    .replace(/\s+/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  // HTTP와 localhost 테스트 시 Referrer-Policy 헤더 설정
  response.headers.set("Referrer-Policy", "no-referrer-when-downgrade");

  return response;
}

// 특정 경로에만 미들웨어 적용
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
