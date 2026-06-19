import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only intercept /api routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const requestOrigin = request.headers.get('origin') || '';
    let allowedOrigin = '';

    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
    if (process.env.NODE_ENV === 'development') {
      allowedOrigin = requestOrigin || '*';
    } else if (allowedOriginsEnv) {
      const whitelist = allowedOriginsEnv.split(',').map(o => o.trim().toLowerCase());
      if (whitelist.includes(requestOrigin.toLowerCase())) {
        allowedOrigin = requestOrigin;
      }
    }

    const isPreflight = request.method === 'OPTIONS';
    
    if (isPreflight && !allowedOrigin) {
      return new NextResponse('CORS Not Allowed', { status: 400 });
    }

    const response = isPreflight
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();

    if (allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Vary', 'Origin');
    }

    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

