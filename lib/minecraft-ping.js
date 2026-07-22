import { status } from "minecraft-server-util";

/**
 * Query status server Minecraft langsung lewat protokol Server List Ping (SLP) —
 * ini protokol bawaan Minecraft yang sama dipakai pas server muncul di tab
 * "Multiplayer" client game, jadi TIDAK butuh plugin tambahan apapun di server.
 *
 * Return null kalau server unreachable/offline (jangan throw, biar landing page
 * tetap render dengan status "Offline" alih-alih error).
 */
export async function getServerStatus(host, port) {
  try {
    const result = await status(host, port, {
      timeout: 5000,
      enableSRV: true,
    });

    return {
      online: true,
      playersOnline: result.players.online,
      playersMax: result.players.max,
      version: result.version?.name || "-",
      motd: result.motd?.clean || "",
    };
  } catch (error) {
    return {
      online: false,
      playersOnline: 0,
      playersMax: 0,
      version: "-",
      motd: "",
    };
  }
}
