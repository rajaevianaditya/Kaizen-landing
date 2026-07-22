"use client";

import { useEffect, useState } from "react";
import { Users, Wifi, Loader2 } from "lucide-react";

export default function ServerStatusStrip() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;

    function load() {
      fetch("/api/server-status")
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setStatus(data);
        })
        .catch(() => {
          if (!cancelled) setStatus({ online: false, playersOnline: 0, playersMax: 0, version: "-" });
        });
    }

    load();
    // Refresh tiap 30 detik biar player count keliatan update tanpa reload manual
    const interval = setInterval(load, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!status) {
    return (
      <div className="status-strip">
        <div className="status-chip">
          <Loader2 size={14} className="spin" />
          Mengecek status server...
        </div>
      </div>
    );
  }

  return (
    <div className="status-strip">
      <div className="status-chip">
        <span className={`status-dot ${status.online ? "online" : "offline"}`} />
        {status.online ? "Server Online" : "Server Offline"}
      </div>

      {status.online && (
        <>
          <div className="status-chip">
            <Users size={15} />
            {status.playersOnline} / {status.playersMax} pemain
          </div>
          <div className="status-chip">
            <Wifi size={15} />
            {status.version}
          </div>
        </>
      )}
    </div>
  );
}
