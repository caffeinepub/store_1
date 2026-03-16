import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Minus, Package, Plus, Trash2, Truck } from "lucide-react";
import { useMemo } from "react";
import { ProductStatus } from "../backend";
import { useCart } from "../contexts/CartContext";
import { useGetProducts } from "../hooks/useProducts";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { data: allProducts = [] } = useGetProducts();

  // Compute upsell suggestions: available products not already in cart, randomly pick up to 3
  const upsellProducts = useMemo(() => {
    const cartProductIds = new Set(items.map((item) => item.product.id));
    const candidates = allProducts.filter(
      (p) =>
        (p.status ?? ProductStatus.available) === ProductStatus.available &&
        !cartProductIds.has(p.id),
    );
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [allProducts, items]);

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center space-y-4" data-ocid="cart.empty_state">
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground">
            Add some items to get started!
          </p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <Card
              key={`${item.product.id}-${item.size}-${item.color}`}
              data-ocid={`cart.item.${index + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-accent/10 flex-shrink-0">
                    {item.product.imageUrls.length > 0 ? (
                      <img
                        src={item.product.imageUrls[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      ${(Number(item.product.price) / 100).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeFromCart(item.product.id, item.size, item.color)
                      }
                      data-ocid={`cart.delete_button.${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity - 1,
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity + 1,
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ${(getCartTotal() / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5" />
                    Shipping
                  </span>
                  <span className="font-medium text-green-400 flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" />
                    Free
                  </span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${(getCartTotal() / 100).toFixed(2)}
                  </span>
                </div>
              </div>
              <Link to="/payment">
                <Button
                  className="w-full"
                  size="lg"
                  data-ocid="cart.primary_button"
                >
                  Proceed to Checkout
                </Button>
              </Link>
              <Link to="/shop" className="block mt-2">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* You might also like upsell section */}
      {upsellProducts.length > 0 && (
        <div className="mt-16" data-ocid="cart.section">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {upsellProducts.map((product, index) => (
              <Link
                key={product.id}
                to="/product/$productId"
                params={{ productId: product.id }}
                data-ocid={`cart.item.${items.length + index + 1}`}
              >
                <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <div className="aspect-square overflow-hidden bg-accent/10">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].getDirectURL()}
                        alt={product.name}
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
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold text-primary">
                      ${(Number(product.price) / 100).toFixed(2)}
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
