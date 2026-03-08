import { Outlet } from "@tanstack/react-router";
import { CartProvider } from "../contexts/CartContext";
import AnnouncementBanner from "./AnnouncementBanner";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <AnnouncementBanner />
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
