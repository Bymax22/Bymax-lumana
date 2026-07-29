export class CreateProductDto {
  name!: string;
  sku!: string;
  description?: string;
  price!: number;
  originalPrice?: number;
  stock!: number;
  categoryId!: string;
  brandId?: string;
  condition?: 'NEW' | 'LIKE_NEW' | 'USED' | 'REFURBISHED';
  compatible?: string[];
  images?: string[];
  specs?: Record<string, any>;
}
