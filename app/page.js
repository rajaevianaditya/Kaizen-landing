"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import CopyIpButton from "../components/CopyIpButton";
import ServerStatusStrip from "../components/ServerStatusStrip";
import LinkGrid from "../components/LinkGrid";
import FeaturesSection from "../components/FeaturesSection";
import GalleryPreview from "../components/GalleryPreview";

export default function HomePage() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch("/api/public-config")
      .then((res) => res.json())
      .then((data) => setConfig(data));
  }, []);

  const serverInfo = config?.serverInfo;
  const links = config?.links || [];
  const features = config?.features || [];

  return (
    <>
      <section className="hero">
        <div className="container">
          {serverInfo?.logoUrl && (
            <img src={serverInfo.logoUrl} alt={serverInfo.serverName} className="hero__logo" />
          )}

          <span className="hero__badge">
            <Sparkles size={13} />
            Minecraft Network
          </span>

          <h1>{serverInfo?.serverName || "GoKaizen Network"}</h1>

          {serverInfo?.description && <p>{serverInfo.description}</p>}

          {serverInfo && (
            <CopyIpButton ip={serverInfo.displayIp} port={serverInfo.displayPort} />
          )}

          <ServerStatusStrip />
        </div>
      </section>

      <FeaturesSection features={features} />

      <GalleryPreview />

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Jelajahi</h2>
          </div>
          <LinkGrid links={links} />
        </div>
      </section>
    </>
  );
}
