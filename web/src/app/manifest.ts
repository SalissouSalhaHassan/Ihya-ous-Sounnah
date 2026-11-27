import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ihya'ous Sounnah — Awqaf & Dawah ERP",
    short_name: "Ihya'ous Sounnah",
    description:
      "المنظومة المتكاملة لإدارة الأوقاف والمساجد وحلقات القرآن الكريم وعقود الزواج (AR / FR / HA)",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#020617",
    theme_color: "#059669",
    categories: ["productivity", "education", "utilities"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Tableau de Bord",
        short_name: "Dashboard",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Bilan 2026",
        short_name: "Bilan 2026",
        url: "/bilan-2026",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Sécurité & Parking",
        short_name: "Sécurité",
        url: "/mosques/security",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
