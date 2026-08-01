import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller(['shop', 'api/shop'])
export class ShopController {
  constructor(private shopService: ShopService) {}

  // ==================== CATEGORIES ====================

  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.shopService.createCategory(dto);
  }

  @Get('categories')
  getCategories() {
    return this.shopService.getCategories();
  }

  @Get('categories/:id')
  getCategoryById(@Param('id') id: string) {
    return this.shopService.getCategoryById(id);
  }

  @Put('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCategoryDto> & { featured?: boolean },
  ) {
    return this.shopService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.shopService.deleteCategory(id);
  }

  // ==================== PRODUCTS ====================

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: CreateProductDto) {
    return this.shopService.createProduct(dto);
  }

  @Get('products')
  getProducts(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('categoryId') categoryId: string,
    @Query('search') search: string,
  ) {
    return this.shopService.getProducts(
      +skip || 0,
      +take || 20,
      categoryId,
      search,
    );
  }

  @Get('products/featured')
  getFeaturedProducts() {
    return this.shopService.getFeaturedProducts();
  }

  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.shopService.getProductById(id);
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: Partial<CreateProductDto> & { featured?: boolean; status?: string }) {
    return this.shopService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.shopService.deleteProduct(id);
  }

  @Put('products/:id/stock')
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.shopService.updateStock(id, quantity);
  }

  // ==================== REVIEWS ====================

  @Post('reviews')
  @HttpCode(HttpStatus.CREATED)
  createReview(@Body() dto: CreateReviewDto) {
    return this.shopService.createReview(dto);
  }

  @Get('products/:id/reviews')
  getProductReviews(
    @Param('id') productId: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    return this.shopService.getProductReviews(productId, +skip || 0, +take || 10);
  }

  // ==================== SHOPPING CART ====================

  @Get('cart/:userId')
  getCart(@Param('userId') userId: string) {
    return this.shopService.getOrCreateCart(userId);
  }

  @Post('cart/:userId/add')
  addToCart(@Param('userId') userId: string, @Body() dto: AddToCartDto) {
    return this.shopService.addToCart(userId, dto);
  }

  @Delete('cart/:userId/remove/:productId')
  removeFromCart(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.shopService.removeFromCart(userId, productId);
  }

  @Delete('cart/:userId/clear')
  clearCart(@Param('userId') userId: string) {
    return this.shopService.clearCart(userId);
  }

  @Put('cart/:userId/items/:productId')
  updateCartItemQuantity(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.shopService.updateCartItemQuantity(userId, productId, quantity);
  }

  // ==================== ORDERS ====================

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Body() dto: CreateOrderDto) {
    return this.shopService.createOrder(dto);
  }

  @Get('orders/:userId')
  getOrders(
    @Param('userId') userId: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    return this.shopService.getOrders(userId, +skip || 0, +take || 10);
  }

  @Get('orders/all')
  getAllOrders(@Query('skip') skip: string, @Query('take') take: string) {
    return this.shopService.getAllOrders(+skip || 0, +take || 20);
  }

  @Get('orders/detail/:id')
  getOrderById(@Param('id') id: string) {
    return this.shopService.getOrderById(id);
  }

  @Get('orders/track/:orderRef')
  trackOrder(@Param('orderRef') orderRef: string) {
    return this.shopService.trackOrder(orderRef);
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.shopService.updateOrderStatus(id, status);
  }

  @Put('orders/:id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.shopService.cancelOrder(id);
  }
}
