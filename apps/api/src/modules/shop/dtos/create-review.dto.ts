export class CreateReviewDto {
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  photos?: string[];
}
