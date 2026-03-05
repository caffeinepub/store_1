import { Outlet } from "@tanstack/react-router";
import { CartProvider } from "../contexts/CartContext";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
