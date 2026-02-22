import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { Size } from '../backend';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const sizeOptions: Size[] = [Size.S, Size.M, Size.L, Size.XL, Size.XXL, Size.XXXL, Size.XXXXL, Size.XXXXXL];

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const { data: products = [] } = useGetProducts();
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor && product.colors.length > 0) {
      toast.error('Please select a color');
      return;
    }

    addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
    toast.success('Added to cart!');
  };

  return (
    <div className="container py-12">
      <Link to="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
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
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    currentImageIndex === index ? 'border-primary' : 'border-transparent'
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

          <p className="text-muted-foreground">{product.description}</p>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions
                  .filter((size) => product.sizes.includes(size))
                  .map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
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
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'default' : 'outline'}
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
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="text-lg font-medium w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
