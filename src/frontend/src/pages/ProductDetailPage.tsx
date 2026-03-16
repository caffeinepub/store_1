import SizeGuideModal from "@/components/SizeGuideModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductStatus, Size } from "../backend";
import { useCart } from "../contexts/CartContext";
import {
  useGetAllProductBulletPoints,
  useGetProducts,
} from "../hooks/useProducts";

const sizeOptions: Size[] = [
  Size.S,
  Size.M,
  Size.L,
  Size.XL,
  Size.XXL,
  Size.XXXL,
  Size.XXXXL,
  Size.XXXXXL,
];

export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const { data: products = [] } = useGetProducts();
  const { data: bulletPointsMap = [] } = useGetAllProductBulletPoints();
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (
    !product ||
    (product.status ?? ProductStatus.available) === ProductStatus.hidden
  ) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Product not found</p>
        <div className="text-center mt-4">
          <Link to="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bulletPoints =
    bulletPointsMap.find(([id]) => id === product.id)?.[1] ?? [];

  const isSoldOut =
    (product.status ?? ProductStatus.available) === ProductStatus.soldOut;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor && product.colors.length > 0) {
      toast.error("Please select a color");
      return;
    }

    addToCart(
      product,
      selectedSize,
      selectedColor || product.colors[0],
      quantity,
    );
    toast.success("Added to cart!");
  };

  // Recommendations: same category first, then pad with others
  const recommendations = (() => {
    const available = products.filter(
      (p) =>
        p.id !== product.id &&
        (p.status ?? ProductStatus.available) === ProductStatus.available,
    );
    const sameCategory = available.filter(
      (p) => p.categoryId === product.categoryId,
    );
    const others = available.filter((p) => p.categoryId !== product.categoryId);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    return [...sameCategory, ...shuffledOthers].slice(0, 4);
  })();

  return (
    <div className="container py-12">
      <Link
        to="/shop"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-accent/10">
            {product.images.length > 0 ? (
              <img
                src={product.images[currentImageIndex].getDirectURL()}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  type="button"
                  key={image.getDirectURL()}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image.getDirectURL()}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">
              ${(Number(product.price) / 100).toFixed(2)}
            </p>
          </div>

          {/* Details: description + bullet points + size guide */}
          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            {bulletPoints.length > 0 && (
              <ul className="space-y-1.5">
                {bulletPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
            <SizeGuideModal />
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 block">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions
                  .filter((size) => product.sizes.includes(size))
                  .map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="min-w-[60px]"
                    >
                      {size}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 block">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-2 block">Quantity</p>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="text-lg font-medium w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            data-ocid="product.primary_button"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isSoldOut ? "Sold Out" : "Add to Cart"}
          </Button>
          {isSoldOut && (
            <p className="text-center text-sm text-muted-foreground">
              This item is currently out of stock.
            </p>
          )}
        </div>
      </div>

      {/* Product Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-20" data-ocid="product.section">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map((rec, index) => (
              <Link
                key={rec.id}
                to="/product/$productId"
                params={{ productId: rec.id }}
                data-ocid={`product.item.${index + 1}`}
              >
                <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <div className="aspect-square overflow-hidden bg-accent/10">
                    {rec.images.length > 0 ? (
                      <img
                        src={rec.images[0].getDirectURL()}
                        alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {rec.name}
                    </h3>
                    <p className="text-sm font-bold text-primary">
                      ${(Number(rec.price) / 100).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
