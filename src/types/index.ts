import type { Product, ProductImage, ProductVariant, Category, Review, User } from "@prisma/client"; // eslint-disable-line @typescript-eslint/no-unused-vars

export type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category;
  reviews: Review[];
  _count?: { reviews: number };
};

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  isOnSale: boolean;
  isFeatured: boolean;
  images: { imageUrl: string; altText: string | null }[];
  category: { name: string; slug: string };
  variants: { size: string | null; color: string | null; stockQuantity: number }[];
  _count?: { reviews: number };
  avgRating?: number;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
  sku: string;
  maxStock: number;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type OrderSummary = {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
};

export type FilterState = {
  category: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  sort: SortOption;
};

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "best_selling"
  | "featured";

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ReviewWithUser = Review & {
  user: Pick<User, "name" | "image">;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}
