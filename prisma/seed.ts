import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@villa.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@villa.com",
      name: "Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.villaSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      villaName: "Villa Serenity",
      tagline: "Your Private Paradise",
      description:
        "Nestled in breathtaking surroundings, Villa Serenity offers an unparalleled luxury escape for discerning travellers seeking exclusivity, comfort, and natural beauty.",
      maxGuests: 10,
      bedrooms: 5,
      bathrooms: 5,
      minNights: 3,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      pricePerNight: 1200,
      currency: "USD",
    },
  });

  console.log("Seed complete. Admin:", admin.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
