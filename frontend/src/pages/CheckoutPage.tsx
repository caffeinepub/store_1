import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Other', label: 'Other' },
];

const shippingOptions = {
  US: [
    { name: 'Economy', basePrice: 399, itemPrice: 209, days: '4-8 business days' },
    { name: 'Standard', basePrice: 475, itemPrice: 240, days: '2-5 business days' },
    { name: 'Express', basePrice: 799, itemPrice: 240, days: '2-3 business days' },
  ],
  Canada: [{ name: 'Standard', basePrice: 939, itemPrice: 439, days: '10-30 business days' }],
  Australia: [{ name: 'Standard', basePrice: 1249, itemPrice: 499, days: '10-30 business days' }],
  Other: [{ name: 'Standard', basePrice: 1000, itemPrice: 400, days: '10-30 business days' }],
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getCartTotal } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('US');
  const [selectedShipping, setSelectedShipping] = useState(0);

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      </div>
    );
  }

  const availableShipping = shippingOptions[country as keyof typeof shippingOptions] || shippingOptions.Other;
  const shipping = availableShipping[selectedShipping];
  const shippingCost = shipping.basePrice + shipping.itemPrice * (items.length - 1);
  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !street || !city || !state || !zip || !country) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Store checkout data in sessionStorage for payment page
    sessionStorage.setItem(
      'checkoutData',
      JSON.stringify({
        address: { name, street, city, state, zip, country },
        shipping,
        total,
      })
    );

    navigate({ to: '/payment' });
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP/Postal Code *</Label>
                    <Input
                      id="zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableShipping.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedShipping === index ? 'border-primary bg-accent' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping === index}
                        onChange={() => setSelectedShipping(index)}
                        className="text-primary"
                      />
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-muted-foreground">{option.days}</p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${((option.basePrice + option.itemPrice * (items.length - 1)) / 100).toFixed(2)}
                    </p>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span>${((Number(item.product.price) * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${(shippingCost / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${(total / 100).toFixed(2)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
