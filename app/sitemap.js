const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kaizen-landing.example.com";

export default function sitemap() {
  const staticRoutes = ["", "/gallery", "/forum", "/login", "/register"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.6,
  }));

  return staticRoutes;

  // Catatan: kalau mau nyertain URL dinamis (misal /forum/[categorySlug] atau
  // /forum/thread/[id]) di sitemap, tambahin query Prisma di sini buat ambil
  // semua kategori/thread, terus map ke bentuk yang sama kayak staticRoutes di atas.
}
