/**
 * Security headers — второй слой защиты для платформы с обещанием zero-data.
 * Если в будущем кто-то случайно добавит внешний скрипт/трекер, CSP его срежет.
 *
 * 'unsafe-inline' для script/style нужен Next.js runtime (chunks loader) и
 * Tailwind. Чтобы убрать — потребуется nonces-pipeline (отдельная задача).
 * connect-src ограничен 'self' — это явно блокирует любые внешние fetch
 * (включая случайно добавленную аналитику), что для нас важнее.
 *
 * В dev CSP не применяется: Next dev runtime использует eval (React Refresh)
 * и websocket (HMR), под жёсткой CSP клиентский JS бы не запустился.
 * Dev-сервер наружу не светит — это безопасно.
 */
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const securityHeaders =
  process.env.NODE_ENV === "production"
    ? [
        { key: "Content-Security-Policy", value: cspDirectives },
        ...baseSecurityHeaders,
      ]
    : baseSecurityHeaders;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
