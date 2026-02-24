import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetProducts } from '../hooks/useProducts';
import { useGetHeroSection } from '../hooks/useHeroSection';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { data: products = [] } = useGetProducts();
  const { data: heroSection } = useGetHeroSection();
  const featuredProducts = products.slice(0, 4);

  const heroImageUrl = heroSection?.image?.getDirectURL();
  const headline = heroSection?.headline || 'STREETWEAR REDEFINED';
  const tagline = heroSection?.tagline || 'Exclusive drops. Limited editions. Unmatched style.';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background overflow-hidden">
        {heroImageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
        )}
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight whitespace-pre-line">
            {headline.split(' ').map((word, i, arr) => (
              i === arr.length - 1 ? (
                <span key={i} className="block text-primary">{word}</span>
              ) : (
                <span key={i}>{word} </span>
              )
            ))}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {tagline}
          </p>
          <Link to="/shop">
            <Button size="lg" className="text-lg px-8">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground">Check out our latest drops</p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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

        <div className="text-center mt-12">
          <Link to="/shop">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
