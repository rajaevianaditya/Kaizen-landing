import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { prisma } from "../lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kaizen-landing.example.com";
const SITE_NAME = "GoKaizen Network";
const SITE_DESCRIPTION =
  "GoKaizen Network — server Minecraft dengan komunitas ramah, event rutin, vote reward, dan forum diskusi aktif. Gabung sekarang, cek status server, dan top-up coins langsung dari sini.";

export async function generateMetadata() {
  // Favicon dinamis: pakai logo yang diupload admin (ServerInfo.logoUrl) kalau
  // ada, fallback ke /logo.png (file statis) kalau admin belum pernah upload.
  let iconUrl = "/logo.png";
  try {
    const serverInfo = await prisma.serverInfo.findUnique({ where: { id: 1 } });
    if (serverInfo?.logoUrl) {
      iconUrl = serverInfo.logoUrl;
    }
  } catch (err) {
    // DB belum siap/query gagal, tetap fallback ke /logo.png, jangan sampai
    // build/render halaman gagal cuma gara-gara favicon.
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
      "server minecraft",
      "minecraft indonesia",
      "gokaizen",
      "vote minecraft",
      "top up coins minecraft",
      "forum minecraft",
      "ban list minecraft",
    ],
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    generator: "Next.js",
    referrer: "origin-when-cross-origin",

    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },

    openGraph: {
      type: "website",
      locale: "id_ID",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [{ url: iconUrl, width: 512, height: 512, alt: SITE_NAME }],
    },

    twitter: {
      card: "summary",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [iconUrl],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="clay-blobs" aria-hidden="true">
          <span className="clay-blob clay-blob--a" />
          <span className="clay-blob clay-blob--b" />
          <span className="clay-blob clay-blob--c" />
        </div>
        <div className="page">
          <Navbar />
          {children}
          <footer className="site-footer">
            <div className="container">
              &copy; {new Date().getFullYear()} GoKaizen Network. Dibuat dengan{" "}
              <a href="https://rajaaditya.my.id" target="_blank" rel="noreferrer">
                rajaaditya.my.id
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}