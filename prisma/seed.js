const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.serverInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      serverName: "GoKaizen Network",
      description: "Server survival & OneBlock dengan komunitas ramah dan event rutin.",
      displayIp: "play.gokaizen.id",
      displayPort: 25565,
      pingHost: "play.gokaizen.id",
      pingPort: 25565,
    },
  });

  const sampleLinks = [
    { label: "Vote Sekarang", url: "https://top-server.example.com/vote", type: "vote", sortOrder: 0 },
    { label: "Coin Store", url: "https://kaizen-store.example.com", type: "store", sortOrder: 1 },
    { label: "Ban List", url: "https://kaizen.rajaaditya.my.id", type: "banlist", sortOrder: 2 },
    { label: "Join Discord", url: "https://discord.gg/example", type: "discord", sortOrder: 3 },
  ];

  for (const link of sampleLinks) {
    await prisma.linkItem.create({ data: link });
  }

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
