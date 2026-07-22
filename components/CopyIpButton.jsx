"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyIpButton({ ip, port }) {
  const [copied, setCopied] = useState(false);

  const displayText = port && port !== 25565 ? `${ip}:${port}` : ip;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      // Clipboard API gagal (browser lama/permission), fallback diam-diam gagal
      // tanpa bikin heboh — user masih bisa select-copy manual dari teks IP-nya.
    }
  }

  return (
    <div className="ip-box">
      <span className="ip-box__text">{displayText}</span>
      <button className={`ip-box__btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Disalin!" : "Copy IP"}
      </button>
    </div>
  );
}
