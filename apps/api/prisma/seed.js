const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lumanainvestment.com' },
    update: {},
    create: {
      email: 'admin@lumanainvestment.com',
      name: 'Lumana Admin',
      phone: '+260966000001',
      role: 'ADMIN',
      password: '$2a$10$9bWgYH7B1Ubf6F2a/0W2YOWfbo9Kc6h5G9WftQhV5JxeJJ2S6A1Ey',
    },
  });

  const dealer = await prisma.dealer.upsert({
    where: { code: 'LUMANA-001' },
    update: {},
    create: {
      name: 'Lumana Motors',
      code: 'LUMANA-001',
      contactName: 'Moses Banda',
      contactPhone: '+260977123456',
      address: 'Lusaka, Zambia',
    },
  });

  const brands = [
    { name: 'Toyota', slug: 'toyota', logoUrl: 'https://res.cloudinary.com/doeufeojs/image/upload/v1784829558/toyota-logos-brands-logotypes-0_dnt7ti.png', featured: true },
    { name: 'Honda', slug: 'honda', logoUrl: 'https://res.cloudinary.com/doeufeojs/image/upload/v1753816085/honda-logo_ho8kzi.png', featured: true },
    { name: 'Nissan', slug: 'nissan', logoUrl: 'https://res.cloudinary.com/doeufeojs/image/upload/v1753816085/nissan-logo_zz2k2z.png', featured: true },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz', logoUrl: 'https://res.cloudinary.com/doeufeojs/image/upload/v1753816085/mercedes-benz-logo_zrfs4x.png', featured: true },
    { name: 'BMW', slug: 'bmw', logoUrl: 'https://res.cloudinary.com/doeufeojs/image/upload/v1753816085/bmw-logo_v3lbhx.png', featured: true },
  ];

  const vehicleCategories = [
    { name: 'Sedan', slug: 'sedan' },
    { name: 'SUV', slug: 'suv' },
    { name: 'Pickup', slug: 'pickup' },
    { name: 'Hybrid', slug: 'hybrid' },
  ];

  const shopCategories = [
    { name: 'Batteries', slug: 'batteries', featured: true },
    { name: 'Brakes', slug: 'brakes', featured: true },
    { name: 'Body Parts', slug: 'body-parts', featured: true },
    { name: 'Accessories', slug: 'accessories', featured: true },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }

  for (const category of vehicleCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  for (const category of shopCategories) {
    await prisma.shopCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const createdBrands = await prisma.brand.findMany();
  const createdCategories = await prisma.category.findMany();
  const createdShopCategories = await prisma.shopCategory.findMany();

  const vehicleSeedData = [
    {
      vin: 'VINTOYOTA001',
      make: 'Toyota',
      model: 'Corolla Cross',
      trim: '1.8 Hybrid X',
      year: 2023,
      mileage: 18000,
      condition: 'USED',
      color: 'Silver',
      transmission: 'CVT',
      engine: '1.8L Hybrid',
      description: 'Well-kept hybrid SUV with low mileage and service history.',
      brandId: createdBrands.find((item) => item.name === 'Toyota')?.id,
      categoryId: createdCategories.find((item) => item.name === 'Hybrid')?.id,
      dealerId: dealer.id,
      images: [
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      vin: 'VINHONDA002',
      make: 'Honda',
      model: 'Civic',
      trim: 'Sport',
      year: 2022,
      mileage: 25000,
      condition: 'USED',
      color: 'Black',
      transmission: 'Automatic',
      engine: '1.5L Turbo',
      description: 'Sporty sedan with excellent fuel economy and modern tech features.',
      brandId: createdBrands.find((item) => item.name === 'Honda')?.id,
      categoryId: createdCategories.find((item) => item.name === 'Sedan')?.id,
      dealerId: dealer.id,
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      vin: 'VINNISSAN003',
      make: 'Nissan',
      model: 'X-Trail',
      trim: 'Acenta',
      year: 2021,
      mileage: 32000,
      condition: 'USED',
      color: 'White',
      transmission: 'CVT',
      engine: '2.0L',
      description: 'Comfortable family SUV with spacious cabin and low running cost.',
      brandId: createdBrands.find((item) => item.name === 'Nissan')?.id,
      categoryId: createdCategories.find((item) => item.name === 'SUV')?.id,
      dealerId: dealer.id,
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      vin: 'VINMERC001',
      make: 'Mercedes-Benz',
      model: 'C-Class',
      trim: 'C200',
      year: 2020,
      mileage: 40000,
      condition: 'USED',
      color: 'Blue',
      transmission: 'Automatic',
      engine: '2.0L Turbo',
      description: 'Premium executive sedan ready for daily use.',
      brandId: createdBrands.find((item) => item.name === 'Mercedes-Benz')?.id,
      categoryId: createdCategories.find((item) => item.name === 'Sedan')?.id,
      dealerId: dealer.id,
      images: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
      ],
    },
  ];

  for (const vehicle of vehicleSeedData) {
    const createdVehicle = await prisma.vehicle.upsert({
      where: { vin: vehicle.vin },
      update: {},
      create: {
        vin: vehicle.vin,
        make: vehicle.make,
        model: vehicle.model,
        trim: vehicle.trim,
        year: vehicle.year,
        mileage: vehicle.mileage,
        condition: vehicle.condition,
        color: vehicle.color,
        transmission: vehicle.transmission,
        engine: vehicle.engine,
        description: vehicle.description,
        dealerId: vehicle.dealerId,
        brandId: vehicle.brandId,
        categoryId: vehicle.categoryId,
      },
    });

    await prisma.vehicleImage.deleteMany({ where: { vehicleId: createdVehicle.id } });
    await prisma.vehicleImage.createMany({
      data: vehicle.images.map((url) => ({ vehicleId: createdVehicle.id, url, publicId: `seed-${createdVehicle.id}-${Date.now()}` })),
    });
  }

  const rentalVehicles = [
    {
      vin: 'VINRENT001',
      make: 'Toyota',
      model: 'Hiace',
      year: 2022,
      mileage: 22000,
      licensePlate: 'ABC123',
      color: 'White',
      transmission: 'Automatic',
      engine: '2.8L Diesel',
      fuelType: 'Diesel',
      seatingCapacity: 12,
      status: 'AVAILABLE',
      location: 'Lusaka',
      description: 'Spacious van available for airport transfers and group travel.',
      basePrice: 120,
      insuranceIncluded: true,
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      vin: 'VINRENT002',
      make: 'Honda',
      model: 'Accord',
      year: 2023,
      mileage: 14000,
      licensePlate: 'XYZ789',
      color: 'Grey',
      transmission: 'CVT',
      engine: '1.5L Turbo',
      fuelType: 'Petrol',
      seatingCapacity: 5,
      status: 'AVAILABLE',
      location: 'Ndola',
      description: 'Elegant sedan for executive travel and city commutes.',
      basePrice: 95,
      insuranceIncluded: true,
      images: [
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
      ],
    },
  ];

  for (const rentalVehicle of rentalVehicles) {
    await prisma.rentalVehicle.upsert({
      where: { vin: rentalVehicle.vin },
      update: {},
      create: {
        vin: rentalVehicle.vin,
        make: rentalVehicle.make,
        model: rentalVehicle.model,
        year: rentalVehicle.year,
        mileage: rentalVehicle.mileage,
        licensePlate: rentalVehicle.licensePlate,
        color: rentalVehicle.color,
        transmission: rentalVehicle.transmission,
        engine: rentalVehicle.engine,
        fuelType: rentalVehicle.fuelType,
        seatingCapacity: rentalVehicle.seatingCapacity,
        status: rentalVehicle.status,
        location: rentalVehicle.location,
        description: rentalVehicle.description,
        basePrice: rentalVehicle.basePrice,
        insuranceIncluded: rentalVehicle.insuranceIncluded,
        images: rentalVehicle.images,
      },
    });
  }

  const productSeedData = [
    {
      name: 'Battery 12V 70Ah',
      sku: 'BAT-12V-70AH',
      description: 'Reliable automotive battery for compact and mid-size sedans.',
      price: 180,
      originalPrice: 220,
      stock: 15,
      categoryId: createdShopCategories.find((item) => item.name === 'Batteries')?.id,
      brandId: createdBrands.find((item) => item.name === 'Toyota')?.id,
      condition: 'NEW',
      compatible: ['Toyota', 'Honda'],
      images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=700&q=80'],
      rating: 4.7,
      featured: true,
      status: 'ACTIVE',
    },
    {
      name: 'Brake Pad Set',
      sku: 'BRAKE-PAD-SET',
      description: 'High-performance front brake pads suitable for daily driving.',
      price: 95,
      originalPrice: 120,
      stock: 22,
      categoryId: createdShopCategories.find((item) => item.name === 'Brakes')?.id,
      brandId: createdBrands.find((item) => item.name === 'Honda')?.id,
      condition: 'NEW',
      compatible: ['Honda', 'Nissan'],
      images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=700&q=80'],
      rating: 4.5,
      featured: true,
      status: 'ACTIVE',
    },
    {
      name: 'Rear Bumper Cover',
      sku: 'BODY-BUMPER-REAR',
      description: 'Durable rear bumper cover for SUVs and crossovers.',
      price: 145,
      originalPrice: 190,
      stock: 10,
      categoryId: createdShopCategories.find((item) => item.name === 'Body Parts')?.id,
      brandId: createdBrands.find((item) => item.name === 'Nissan')?.id,
      condition: 'NEW',
      compatible: ['Nissan', 'Toyota'],
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'],
      rating: 4.3,
      featured: true,
      status: 'ACTIVE',
    },
  ];

  for (const product of productSeedData) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        categoryId: product.categoryId,
        brandId: product.brandId,
        condition: product.condition,
        compatible: product.compatible,
        images: product.images,
        rating: product.rating,
        featured: product.featured,
        status: product.status,
      },
    });
  }

  const auctions = [
    {
      title: 'BMW X5 Premium Auction',
      description: 'Luxury SUV with premium interior and full service history.',
      vehicleId: (await prisma.vehicle.findUnique({ where: { vin: 'VINMERC001' } }))?.id,
      sellerId: adminUser.id,
      startingPrice: 18000,
      reservePrice: 22000,
      currentPrice: 18500,
      startAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
      endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
      status: 'LIVE',
    },
  ];

  for (const auction of auctions) {
    if (auction.vehicleId) {
      await prisma.auction.create({ data: auction });
    }
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
