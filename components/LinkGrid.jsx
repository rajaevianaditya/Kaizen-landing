"use client";

import { ThumbsUp, ShoppingBag, ShieldAlert, MessageCircle, Link2, ArrowUpRight, PackageOpen } from "lucide-react";

const ICON_MAP = {
  vote: ThumbsUp,
  store: ShoppingBag,
  banlist: ShieldAlert,
  discord: MessageCircle,
  custom: Link2,
};

const TAGLINE_MAP = {
  vote: "Dukung server, dapetin reward",
  store: "Top-up coins & item premium",
  banlist: "Cek riwayat moderasi",
  discord: "Ngobrol bareng komunitas",
  custom: "Kunjungi halaman ini",
};

export default function LinkGrid({ links }) {
  if (!links || links.length === 0) {
    return (
      <div className="empty-state">
        <PackageOpen size={28} style={{ marginBottom: 10 }} />
        <p>Belum ada link yang ditambahkan. Atur dari halaman admin.</p>
      </div>
    );
  }

  const [hero, ...rest] = links;

  return (
    <div className="link-bento">
      <LinkTile link={hero} featured />

      {rest.length > 0 && (
        <div className="link-bento__rest">
          {rest.map((link) => (
            <LinkTile key={link.id} link={link} />
          ))}
        </div>
      )}
    </div>
  );
}

function LinkTile({ link, featured }) {
  const Icon = ICON_MAP[link.type] || Link2;
  const isExternal = link.url.startsWith("http");
  const tagline = TAGLINE_MAP[link.type] || "";

  return (
    <a
      href={link.url}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noreferrer" : undefined}
      className={`link-tile ${featured ? "link-tile--featured" : ""}`}
    >
      <div className={`link-tile__icon ${link.type}`}>
        <Icon size={featured ? 30 : 20} strokeWidth={2.2} />
      </div>

      <div className="link-tile__body">
        <div className="link-tile__label">{link.label}</div>
        {featured && tagline && <div className="link-tile__tagline">{tagline}</div>}
      </div>

      <ArrowUpRight size={featured ? 22 : 16} className="link-tile__arrow" />
    </a>
  );
}
