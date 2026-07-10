export class CreateAuctionDto {
  title?: string;
  vehicleId!: string;
  sellerId!: string;
  startPrice!: number;
  reservePrice?: number;
  startTime!: Date;
  endTime!: Date;
  description?: string;
  status?: string;
}

export class UpdateAuctionDto {
  startPrice?: number;
  reservePrice?: number;
  startTime?: Date;
  endTime?: Date;
  description?: string;
  status?: string;
}
