export class CreateInsurancePlanDto {
  name: string;
  description?: string;
  coverage: string;
  dailyPrice: number;
  maxCoverage: number;
  deductible?: number;
  features?: string[];
}
