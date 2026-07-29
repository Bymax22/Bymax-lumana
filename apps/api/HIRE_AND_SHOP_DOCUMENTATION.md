# Vehicle Hire System & Auto Shop Implementation

## Overview
This document outlines the two new comprehensive systems added to the Lumana Car Planet application:
1. **Vehicle Hire System** - Realtime car rental management with GPS tracking
2. **Auto Shop/Spare Parts Store** - Full e-commerce platform for automotive accessories

---

## 1. VEHICLE HIRE SYSTEM

### Features

#### 1.1 Rental Vehicle Management
- Add and manage rental fleet
- Track vehicle status (AVAILABLE, BOOKED, IN_USE, MAINTENANCE, DAMAGED, RETIRED)
- VIN, license plate, and vehicle specifications
- Support for GPS device integration
- Bulk image uploads for vehicle galleries
- Custom metadata storage

**Endpoints:**
- `POST /api/hire/vehicles` - Add rental vehicle
- `GET /api/hire/vehicles` - List all rental vehicles (paginated)
- `GET /api/hire/vehicles/:id` - Get vehicle details with booking history
- `PUT /api/hire/vehicles/:id` - Update vehicle information
- `GET /api/hire/vehicles/available?pickupDate=...&returnDate=...` - Find available vehicles

#### 1.2 Rental Bookings
- Create bookings with automatic conflict detection
- Real-time availability checking
- Dynamic pricing based on rental duration
- Booking lifecycle management (PENDING → CONFIRMED → IN_PROGRESS → COMPLETED)
- Support for cancellations and no-shows
- Automatic cost calculation with insurance add-ons

**Endpoints:**
- `POST /api/hire/bookings` - Create new booking
- `GET /api/hire/bookings?userId=...` - Get user's bookings
- `GET /api/hire/bookings/:id` - Get booking details
- `PUT /api/hire/bookings/:id/status` - Update booking status
- `PUT /api/hire/bookings/:id/complete` - Mark booking complete
- `PUT /api/hire/bookings/:id/cancel` - Cancel booking

#### 1.3 Insurance Plans
- Multiple insurance coverage options
- Tiered coverage levels (Basic, Premium, Full Coverage)
- Daily pricing with maximum coverage limits
- Deductible options
- Feature-based insurance plans

**Endpoints:**
- `POST /api/hire/insurance-plans` - Create insurance plan
- `GET /api/hire/insurance-plans` - List all active plans
- `GET /api/hire/insurance-plans/:id` - Get plan details

#### 1.4 Realtime GPS Tracking
- Track active rentals in real-time
- Record vehicle location, speed, heading, and accuracy
- GPS history with timestamps
- Latest location retrieval
- Indexed queries for performance optimization

**Endpoints:**
- `POST /api/hire/gps/track` - Record GPS location
- `GET /api/hire/gps/:vehicleId/history` - Get GPS history (configurable limit)
- `GET /api/hire/gps/:vehicleId/latest` - Get current location

#### 1.5 Damage Reporting
- Report damage during or after rental
- Multiple damage levels (MINOR, MODERATE, SEVERE, TOTAL_LOSS)
- Photo evidence upload support
- Cost estimation
- Damage report approval/rejection workflow

**Endpoints:**
- `POST /api/hire/damage-reports` - Report damage
- `GET /api/hire/damage-reports?vehicleId=...` - List damage reports
- `PUT /api/hire/damage-reports/:id/approve` - Approve report
- `PUT /api/hire/damage-reports/:id/reject` - Reject report

#### 1.6 Dynamic Pricing
- Seasonal pricing adjustments
- Multi-tier rate options (daily, weekly, monthly)
- Discount percentage support
- Price override for special promotions
- Historical pricing tracking

**Endpoints:**
- `POST /api/hire/pricing/seasonal` - Set seasonal pricing
- `GET /api/hire/pricing/:vehicleId` - Get pricing history

### Database Models
- `RentalVehicle` - Fleet inventory
- `RentalBooking` - Rental reservations
- `InsurancePlan` - Insurance options
- `DamageReport` - Damage tracking
- `GPSTracking` - Location history
- `RentalPricing` - Dynamic pricing

---

## 2. AUTO SHOP / SPARE PARTS STORE

### Features

#### 2.1 Product Management
- Comprehensive product catalog
- SKU-based inventory system
- Multiple product conditions (NEW, LIKE_NEW, USED, REFURBISHED)
- Vehicle compatibility tracking
- Product specifications in JSON format
- Featured product highlighting
- Bulk image support

**Endpoints:**
- `POST /api/shop/products` - Create product
- `GET /api/shop/products?skip=...&take=...&categoryId=...&search=...` - Search products
- `GET /api/shop/products/featured` - Get featured products
- `GET /api/shop/products/:id` - Get product details with reviews
- `PUT /api/shop/products/:id` - Update product
- `PUT /api/shop/products/:id/stock` - Adjust inventory

#### 2.2 Product Categories
- Hierarchical category structure
- Featured categories for homepage
- Icon support for UI
- Dynamic slug generation
- Product count tracking

**Endpoints:**
- `POST /api/shop/categories` - Create category
- `GET /api/shop/categories` - List all categories
- `GET /api/shop/categories/:id` - Get category with products

#### 2.3 Reviews & Ratings
- 5-star rating system
- Text reviews with photo evidence
- Verified purchase badges
- Helpful vote tracking
- Automatic average rating calculation

**Endpoints:**
- `POST /api/shop/reviews` - Submit review
- `GET /api/shop/products/:id/reviews` - Get product reviews

#### 2.4 Shopping Cart
- Per-user shopping cart
- Add/remove items
- Quantity management
- Stock validation
- Real-time cart updates

**Endpoints:**
- `GET /api/shop/cart/:userId` - Get user's cart
- `POST /api/shop/cart/:userId/add` - Add item to cart
- `DELETE /api/shop/cart/:userId/remove/:productId` - Remove item
- `DELETE /api/shop/cart/:userId/clear` - Clear entire cart
- `PUT /api/shop/cart/:userId/items/:productId` - Update quantity

#### 2.5 Order Management
- Complete order lifecycle (PENDING → PROCESSING → SHIPPED → DELIVERED)
- Automatic tax calculation (10%)
- Flat shipping costs
- Tracking number support
- Order status history
- Order cancellation with automatic stock restoration

**Endpoints:**
- `POST /api/shop/orders` - Create order from cart
- `GET /api/shop/orders/:userId` - Get user's orders
- `GET /api/shop/orders/detail/:id` - Get order details
- `GET /api/shop/orders/track/:orderRef` - Track order by reference
- `PUT /api/shop/orders/:id/status` - Update order status
- `PUT /api/shop/orders/:id/cancel` - Cancel order

#### 2.6 Inventory Management
- Real-time stock tracking
- Stock validation on purchases
- Automatic stock deduction on order creation
- Stock restoration on order cancellation
- Low stock warnings

### Database Models
- `ShopCategory` - Product categories
- `Product` - Product catalog
- `Review` - Customer reviews
- `ShoppingCart` - User carts
- `CartItem` - Cart contents
- `Order` - Customer orders
- `OrderItem` - Order line items

---

## 3. API RESPONSE PATTERNS

### Success Response
```json
{
  "data": { /* resource data */ },
  "total": 100,
  "skip": 0,
  "take": 10
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

---

## 4. AUTHENTICATION & AUTHORIZATION

Both systems require user authentication. Controllers should be decorated with:
```typescript
@UseGuards(AuthGuard)
```

User roles supported:
- CUSTOMER - Can browse and purchase
- DEALER - Can manage inventory
- ADMIN - Full system access

---

## 5. FILE STRUCTURE

```
src/modules/
├── hire/
│   ├── dtos/
│   │   ├── create-rental-vehicle.dto.ts
│   │   ├── create-rental-booking.dto.ts
│   │   ├── create-insurance-plan.dto.ts
│   │   ├── report-damage.dto.ts
│   │   └── gps-location.dto.ts
│   ├── hire.service.ts
│   ├── hire.controller.ts
│   └── hire.module.ts
│
└── shop/
    ├── dtos/
    │   ├── create-product.dto.ts
    │   ├── create-category.dto.ts
    │   ├── create-review.dto.ts
    │   ├── add-to-cart.dto.ts
    │   └── create-order.dto.ts
    ├── shop.service.ts
    ├── shop.controller.ts
    └── shop.module.ts
```

---

## 6. DATABASE MIGRATION

The migration file has been created at:
`prisma/migrations/20260724_add_hire_and_shop_systems/migration.sql`

To apply the migration when database is available:
```bash
npx prisma migrate deploy
```

---

## 7. QUICK START

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
cd apps/api
npx prisma generate
```

### 3. Apply Database Migration
```bash
cd apps/api
npx prisma migrate deploy
```

### 4. Start API Server
```bash
npm run dev
```

---

## 8. TESTING THE SYSTEMS

### Create a Rental Vehicle
```bash
POST /api/hire/vehicles
{
  "vin": "1HGCV41JXMN109186",
  "make": "Honda",
  "model": "Civic",
  "year": 2022,
  "licensePlate": "ABC123",
  "basePrice": 50,
  "seatingCapacity": 5,
  "color": "Silver"
}
```

### Create a Booking
```bash
POST /api/hire/bookings
{
  "rentalVehicleId": "...",
  "userId": "...",
  "pickupDate": "2024-08-01T08:00:00Z",
  "returnDate": "2024-08-05T16:00:00Z",
  "pickupLocation": "Airport",
  "returnLocation": "Downtown",
  "insurancePlanId": "..."
}
```

### Create a Shop Product
```bash
POST /api/shop/products
{
  "name": "Synthetic Motor Oil 5W-30",
  "sku": "OIL-5W30-1L",
  "price": 25.99,
  "stock": 100,
  "categoryId": "...",
  "compatible": ["Honda", "Toyota", "Nissan"]
}
```

### Create an Order
```bash
POST /api/shop/orders
{
  "userId": "...",
  "shippingAddress": "123 Main St, City, State 12345"
}
```

---

## 9. FUTURE ENHANCEMENTS

### Vehicle Hire System
- Mobile app integration for real-time tracking
- SMS/Email notifications for bookings
- Automated insurance claim processing
- Vehicle maintenance scheduling
- Driver license verification

### Auto Shop
- AI-powered product recommendations
- Subscription-based spare parts delivery
- Wholesale pricing for dealers
- Inventory synchronization with suppliers
- Advanced analytics and reporting

---

## 10. CONTACT & SUPPORT

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Review API documentation

---

**Last Updated:** July 24, 2026
**Version:** 1.0.0
