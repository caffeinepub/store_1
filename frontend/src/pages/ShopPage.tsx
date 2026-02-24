import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetProducts } from '../hooks/useProducts';
import { useGetCategories } from '../hooks/useCategories';

export default function ShopPage() {
  const { data: products = [] } = useGetProducts();
  const { data: categories = [] } = useGetCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sortedCategories = [...categories].sort((a, b) => Number(a.order) - Number(b.order));

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.categoryId === selectedCategory);

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shop</h1>
        <p className="text-muted-foreground">Browse our collection</p>
      </div>

      {/* Horizontal Pill Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="rounded-full px-6 whitespace-nowrap transition-all duration-200"
            >
              All
            </Button>
            {sortedCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full px-6 whitespace-nowrap transition-all duration-200"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {selectedCategory === 'all' 
              ? 'No products available yet. Check back soon!' 
              : 'No products in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to="/product/$productId" params={{ productId: product.id }}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square overflow-hidden bg-accent/10">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0].getDirectURL()}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    ${(Number(product.price) / 100).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
