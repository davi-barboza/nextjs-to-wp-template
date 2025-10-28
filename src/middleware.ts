import { NextResponse, NextRequest } from 'next/server';
import CONSTANTS from '@/domain/constans';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(CONSTANTS.Auth.accessToken)?.value;

  if (!token && request.nextUrl.pathname === '/') return NextResponse.next();

  if (!!token && request.nextUrl.pathname === '/') return NextResponse.redirect(new URL('/dashboard', request.url));

  if (!token) return NextResponse.redirect(new URL('/', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard'],
};
