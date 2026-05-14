import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ProductCardData[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, className, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2 md:grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={cn(`grid ${gridCols[columns]} gap-4 lg:gap-6`, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
