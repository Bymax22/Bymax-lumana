const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const counts = {
    brands: await prisma.brand.count(),
    categories: await prisma.category.count(),
    shopCategories: await prisma.shopCategory.count(),
    dealers: await prisma.dealer.count(),
    vehicles: await prisma.vehicle.count(),
    rentalVehicles: await prisma.rentalVehicle.count(),
    products: await prisma.product.count(),
    auctions: await prisma.auction.count(),
  };

  console.log(JSON.stringify(counts, null, 2));
  await prisma.$disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
