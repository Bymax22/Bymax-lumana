import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { CreateOrderDto } from './dtos/create-order.dto';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  // ==================== CATEGORIES ====================

  async createCategory(dto: CreateCategoryDto) {
    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');

    const categoryExists = await this.prisma.shopCategory.findUnique({
      where: { slug },
    });

    if (categoryExists) {
      throw new BadRequestException('Category already exists');
    }

    return this.prisma.shopCategory.create({
      data: {
        ...dto,
        slug,
      },
    });
  }

  async getCategories() {
    return this.prisma.shopCategory.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.shopCategory.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, data: Partial<CreateCategoryDto> & { featured?: boolean }) {
    const category = await this.prisma.shopCategory.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const payload: Record<string, any> = { ...data };

    if (data.name) {
      const slug = data.name.toLowerCase().replace(/\s+/g, '-');
      const existing = await this.prisma.shopCategory.findFirst({
        where: { slug, NOT: { id } },
      });

      if (existing) {
        throw new BadRequestException('Category already exists');
      }

      payload.slug = slug;
    }

    return this.prisma.shopCategory.update({
      where: { id },
      data: payload,
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.shopCategory.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.products.length > 0) {
      throw new BadRequestException('Remove products before deleting this category');
    }

    return this.prisma.shopCategory.delete({ where: { id } });
  }

  // ==================== PRODUCTS ====================

  async createProduct(dto: CreateProductDto) {
    const skuExists = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });

    if (skuExists) {
      throw new BadRequestException('Product with this SKU already exists');
    }

    const category = await this.prisma.shopCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.product.create({
      data: {
        ...dto,
        condition: dto.condition || 'NEW',
      },
    });
  }

  async getProducts(skip = 0, take = 20, categoryId?: string, search?: string) {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          reviews: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
      skip,
      take,
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(
    id: string,
    data: Partial<CreateProductDto> & { featured?: boolean; status?: string },
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (data.categoryId) {
      const category = await this.prisma.shopCategory.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    if (data.sku) {
      const existing = await this.prisma.product.findFirst({
        where: { sku: data.sku, NOT: { id } },
      });

      if (existing) {
        throw new BadRequestException('Product with this SKU already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.delete({ where: { id } });
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock + quantity < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: product.stock + quantity },
    });
  }

  async getFeaturedProducts() {
    return this.prisma.product.findMany({
      where: { featured: true },
      include: { category: true, reviews: true },
      take: 12,
    });
  }

  // ==================== REVIEWS ====================

  async createReview(dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const review = await this.prisma.review.create({
      data: dto,
    });

    // Update product rating
    const reviews = await this.prisma.review.findMany({
      where: { productId: dto.productId },
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { rating: avgRating },
    });

    return review;
  }

  async getProductReviews(productId: string, skip = 0, take = 10) {
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { productId } }),
    ]);

    return {
      data: reviews,
      total,
      skip,
      take,
    };
  }

  // ==================== SHOPPING CART ====================

  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.shoppingCart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await this.prisma.shoppingCart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    let cart = await this.getOrCreateCart(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    return this.getOrCreateCart(userId);
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getOrCreateCart(userId);
  }

  async updateCartItemQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    await this.prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      data: { quantity },
    });

    return this.getOrCreateCart(userId);
  }

  // ==================== ORDERS ====================

  async createOrder(dto: CreateOrderDto) {
    const { paymentMethod, ...orderPayload } = dto;
    const cart = await this.getOrCreateCart(dto.userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of cart.items) {
      subtotal += item.product.price * item.quantity;

      // Check stock
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name}`,
        );
      }
    }

    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = cart.items.length > 0 ? 10 : 0;
    const totalAmount = subtotal + tax + shippingCost;

    const orderRef = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderRef,
        userId: dto.userId,
        shippingAddress: orderPayload.shippingAddress,
        notes: orderPayload.notes,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        status: 'PENDING',
        paymentStatus: ['BANK_TRANSFER', 'CASH'].includes(paymentMethod || '') ? 'PENDING' : 'COMPLETED',
      },
    });

    if (dto.paymentMethod) {
      await this.prisma.payment.create({
        data: {
          userId: dto.userId,
          amount: totalAmount,
          currency: 'USD',
          provider: dto.paymentMethod,
          providerRef: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: ['BANK_TRANSFER', 'CASH'].includes(dto.paymentMethod) ? 'PENDING' : 'COMPLETED',
          orderId: order.id,
          metadata: {
            paymentMethod: dto.paymentMethod,
            items: cart.items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });
    }

    // Create order items and update stock
    for (const cartItem of cart.items) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
          unitPrice: cartItem.product.price,
          totalPrice: cartItem.product.price * cartItem.quantity,
        },
      });

      // Update product stock
      await this.updateStock(cartItem.product.id, -cartItem.quantity);
    }

    // Clear cart
    await this.clearCart(dto.userId);

    return this.getOrderById(order.id);
  }

  async getOrders(userId: string, skip = 0, take = 10) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      total,
      skip,
      take,
    };
  }

  async getAllOrders(skip = 0, take = 20) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);

    return {
      data: orders,
      total,
      skip,
      take,
    };
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: status as $Enums.OrderStatus },
    });
  }

  async cancelOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Restore stock
    for (const item of order.items) {
      await this.updateStock(item.productId, item.quantity);
    }

    return this.updateOrderStatus(id, 'CANCELLED');
  }

  async trackOrder(orderRef: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderRef },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
