import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type Category,
  ExternalBlob,
  type Product,
  ProductStatus,
  Size,
} from "../backend";
import {
  useAddProduct,
  useSetProductBulletPoints,
  useUpdateProduct,
} from "../hooks/useProducts";

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

const SIZES: Size[] = [
  Size.S,
  Size.M,
  Size.L,
  Size.XL,
  Size.XXL,
  Size.XXXL,
  Size.XXXXL,
  Size.XXXXXL,
];

type IdValue = { id: string; value: string };

let idCounter = 0;
const newId = () => `id-${++idCounter}`;

const toIdValues = (arr: string[]): IdValue[] =>
  arr.map((value) => ({ id: newId(), value }));

export default function ProductForm({
  product,
  categories,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bulletPoints, setBulletPoints] = useState<IdValue[]>([]);
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<IdValue[]>([{ id: newId(), value: "" }]);
  const [images, setImages] = useState<ExternalBlob[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: number;
  }>({});
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<ProductStatus>(ProductStatus.available);

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const setProductBulletPoints = useSetProductBulletPoints();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setBulletPoints([]);
      setPrice((Number(product.price) / 100).toString());
      setCategoryId(product.categoryId);
      setSelectedSizes(product.sizes);
      setColors(
        product.colors.length > 0
          ? toIdValues(product.colors)
          : [{ id: newId(), value: "" }],
      );
      setImages(product.images);
      setFeatured(product.featured ?? false);
      setStatus(product.status ?? ProductStatus.available);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: Size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const addColor = () => {
    setColors((prev) => [...prev, { id: newId(), value: "" }]);
  };

  const updateColor = (id: string, value: string) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
  };

  const removeColor = (id: string) => {
    setColors((prev) => prev.filter((c) => c.id !== id));
  };

  const addBulletPoint = () => {
    setBulletPoints((prev) => [...prev, { id: newId(), value: "" }]);
  };

  const updateBulletPoint = (id: string, value: string) => {
    setBulletPoints((prev) =>
      prev.map((b) => (b.id === id ? { ...b, value } : b)),
    );
  };

  const removeBulletPoint = (id: string) => {
    setBulletPoints((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !categoryId ||
      selectedSizes.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const filteredColors = colors
      .map((c) => c.value)
      .filter((c) => c.trim() !== "");
    if (filteredColors.length === 0) {
      toast.error("Please add at least one color");
      return;
    }

    const filteredBulletPoints = bulletPoints
      .map((b) => b.value)
      .filter((b) => b.trim() !== "");

    try {
      // Upload new image files
      const uploadedImages: ExternalBlob[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
          (percentage) => {
            setUploadProgress((prev) => ({ ...prev, [i]: percentage }));
          },
        );
        uploadedImages.push(blob);
      }

      const allImages = [...images, ...uploadedImages];

      const productData: Product = {
        id: product?.id || `product-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        // Keep for backward compat with backend.ts type — bullet points are
        // saved separately via setProductBulletPoints after the product save.
        bulletPoints: filteredBulletPoints,
        price: BigInt(Math.round(Number.parseFloat(price) * 100)),
        images: allImages,
        sizes: selectedSizes,
        colors: filteredColors,
        categoryId,
        weight: BigInt(500),
        order: product?.order || BigInt(0),
        featured: featured,
        status: status,
      };

      let savedId: string;
      if (product) {
        await updateProduct.mutateAsync(productData);
        savedId = productData.id;
        toast.success("Product updated successfully");
      } else {
        await addProduct.mutateAsync(productData);
        savedId = productData.id;
        toast.success("Product added successfully");
      }

      await setProductBulletPoints.mutateAsync({
        id: savedId,
        points: filteredBulletPoints,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const isLoading =
    addProduct.isPending ||
    updateProduct.isPending ||
    setProductBulletPoints.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Product Details (bullet points)</Label>
        {bulletPoints.map((bp) => (
          <div key={bp.id} className="flex gap-2">
            <Input
              value={bp.value}
              onChange={(e) => updateBulletPoint(bp.id, e.target.value)}
              placeholder="e.g. 100% cotton, machine washable"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeBulletPoint(bp.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addBulletPoint}>
          Add bullet point
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sizes *</Label>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={() => toggleSize(size)}
              />
              <Label htmlFor={`size-${size}`} className="cursor-pointer">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Colors *</Label>
        {colors.map((color) => (
          <div key={color.id} className="flex gap-2">
            <Input
              value={color.value}
              onChange={(e) => updateColor(color.id, e.target.value)}
              placeholder="Enter color name"
            />
            {colors.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeColor(color.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addColor}>
          Add Color
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Product Images</Label>
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={img.getDirectURL()} className="relative">
              <img
                src={img.getDirectURL()}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {imageFiles.map((file, index) => (
            <div key={`file-${file.name}-${index}`} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              {uploadProgress[index] !== undefined &&
                uploadProgress[index] < 100 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <span className="text-white text-sm">
                      {uploadProgress[index]}%
                    </span>
                  </div>
                )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeImageFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Product Status</Label>
        <Select
          value={status}
          onValueChange={(val) => setStatus(val as ProductStatus)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ProductStatus.available}>Available</SelectItem>
            <SelectItem value={ProductStatus.soldOut}>Sold Out</SelectItem>
            <SelectItem value={ProductStatus.hidden}>Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={featured}
          onCheckedChange={(checked) => setFeatured(checked === true)}
        />
        <Label htmlFor="featured">Featured on homepage</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
