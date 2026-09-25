import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["prevent-coordinates-shed-conventional.trycloudflare.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // TODO: reemplazar <project-ref> por el ref real de Supabase una vez
      // creado el proyecto (es el subdominio de NEXT_PUBLIC_SUPABASE_URL).
      {
        protocol: "https",
        hostname: "gdfkdyqitpumotelavfi.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "drive.usercontent.google.com",
      },
    ],
  },
};

export default nextConfig;
