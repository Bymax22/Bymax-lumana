CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'SOLD');

ALTER TABLE "Vehicle" ADD COLUMN "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE';

CREATE TABLE "VehicleSave" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleSave_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VehicleSave_vehicleId_userId_key" ON "VehicleSave"("vehicleId", "userId");
CREATE INDEX "VehicleSave_vehicleId_idx" ON "VehicleSave"("vehicleId");

ALTER TABLE "VehicleSave" ADD CONSTRAINT "VehicleSave_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VehicleSave" ADD CONSTRAINT "VehicleSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;