import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const inchesData = [
  { size: "S", chest: '18"', length: '28"' },
  { size: "M", chest: '20"', length: '29"' },
  { size: "L", chest: '22"', length: '30"' },
  { size: "XL", chest: '24"', length: '31"' },
  { size: "XXL", chest: '26"', length: '32"' },
];

const cmData = [
  { size: "S", chest: "45.7 cm", length: "71.1 cm" },
  { size: "M", chest: "50.8 cm", length: "73.7 cm" },
  { size: "L", chest: "55.9 cm", length: "76.2 cm" },
  { size: "XL", chest: "61.0 cm", length: "78.7 cm" },
  { size: "XXL", chest: "66.0 cm", length: "81.3 cm" },
];

export default function SizeGuideModal() {
  const [unit, setUnit] = useState<"us" | "intl">("us");
  const data = unit === "us" ? inchesData : cmData;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-sm underline text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          data-ocid="product.open_modal_button"
        >
          Size Guide
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md" data-ocid="product.dialog">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={unit === "us" ? "default" : "outline"}
            size="sm"
            onClick={() => setUnit("us")}
            data-ocid="product.tab"
          >
            US (inches)
          </Button>
          <Button
            variant={unit === "intl" ? "default" : "outline"}
            size="sm"
            onClick={() => setUnit("intl")}
            data-ocid="product.tab"
          >
            International (cm)
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Chest</TableHead>
              <TableHead>Length</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.size}>
                <TableCell className="font-medium">{row.size}</TableCell>
                <TableCell>{row.chest}</TableCell>
                <TableCell>{row.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="text-xs text-muted-foreground mt-3">
          Measurements are approximate. If you&apos;re between sizes, we
          recommend sizing up.
        </p>
      </DialogContent>
    </Dialog>
  );
}
