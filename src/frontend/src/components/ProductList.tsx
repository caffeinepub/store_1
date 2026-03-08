import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Search, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Category, type Product, ProductStatus } from "../backend";
import {
  useDeleteProduct,
  useSetProductFeatured,
  useSetProductStatus,
} from "../hooks/useProducts";

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
}

export default function ProductList({
  products,
  categories,
  onEdit,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteProduct = useDeleteProduct();
  const setProductFeatured = useSetProductFeatured();
  const setProductStatus = useSetProductStatus();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted successfully");
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await setProductFeatured.mutateAsync({
        id: product.id,
        featured: !product.featured,
      });
      toast.success(
        product.featured
          ? "Product removed from featured"
          : "Product marked as featured",
      );
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleStatusChange = async (
    product: Product,
    newStatus: ProductStatus,
  ) => {
    try {
      await setProductStatus.mutateAsync({ id: product.id, status: newStatus });
      toast.success(`Product status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getStatusBadgeClass = (status: ProductStatus | undefined) => {
    switch (status) {
      case ProductStatus.soldOut:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case ProductStatus.hidden:
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                {product.images.length > 0 && (
                  <img
                    src={product.images[0].getDirectURL()}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg leading-tight pr-2">
                    {product.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleToggleFeatured(product)}
                    disabled={setProductFeatured.isPending}
                    data-ocid={`product.toggle.${index + 1}`}
                    title={
                      product.featured
                        ? "Remove from featured"
                        : "Mark as featured"
                    }
                  >
                    <Star
                      className={`h-4 w-4 ${product.featured ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                    />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {getCategoryName(product.categoryId)}
                </p>
                {/* Status selector */}
                <div className="mb-3">
                  <Select
                    value={product.status ?? ProductStatus.available}
                    onValueChange={(val) =>
                      handleStatusChange(product, val as ProductStatus)
                    }
                    disabled={setProductStatus.isPending}
                  >
                    <SelectTrigger
                      className={`h-8 text-xs border ${getStatusBadgeClass(product.status)}`}
                      data-ocid={`product.select.${index + 1}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProductStatus.available}>
                        ✓ Available
                      </SelectItem>
                      <SelectItem value={ProductStatus.soldOut}>
                        ⊘ Sold Out
                      </SelectItem>
                      <SelectItem value={ProductStatus.hidden}>
                        ⊘ Hidden
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-lg font-bold text-primary mb-2">
                  ${(Number(product.price) / 100).toFixed(2)}
                </p>
                <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                  <span>Sizes: {product.sizes.join(", ")}</span>
                  <span>•</span>
                  <span>{product.colors.length} colors</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(product.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
