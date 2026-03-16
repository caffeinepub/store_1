import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface ShippingRatesForm {
  usEconomyBase: string;
  usEconomyPerItem: string;
  usStandardBase: string;
  usStandardPerItem: string;
  usExpressBase: string;
  usExpressPerItem: string;
  canadaBase: string;
  canadaPerItem: string;
  australiaBase: string;
  australiaPerItem: string;
  restOfWorldBase: string;
  restOfWorldPerItem: string;
}

const DEFAULT_RATES: ShippingRatesForm = {
  usEconomyBase: "3.99",
  usEconomyPerItem: "2.09",
  usStandardBase: "4.75",
  usStandardPerItem: "2.40",
  usExpressBase: "7.99",
  usExpressPerItem: "2.40",
  canadaBase: "9.39",
  canadaPerItem: "4.39",
  australiaBase: "12.49",
  australiaPerItem: "4.99",
  restOfWorldBase: "10.00",
  restOfWorldPerItem: "4.00",
};

const RATE_ROWS = [
  {
    label: "US Economy",
    baseKey: "usEconomyBase",
    perItemKey: "usEconomyPerItem",
  },
  {
    label: "US Standard",
    baseKey: "usStandardBase",
    perItemKey: "usStandardPerItem",
  },
  {
    label: "US Express",
    baseKey: "usExpressBase",
    perItemKey: "usExpressPerItem",
  },
  {
    label: "Canada Standard",
    baseKey: "canadaBase",
    perItemKey: "canadaPerItem",
  },
  {
    label: "Australia Standard",
    baseKey: "australiaBase",
    perItemKey: "australiaPerItem",
  },
  {
    label: "Rest of World Standard",
    baseKey: "restOfWorldBase",
    perItemKey: "restOfWorldPerItem",
  },
] as const;

function centsToDisplay(cents: bigint): string {
  return (Number(cents) / 100).toFixed(2);
}

function displayToCents(val: string): bigint {
  const parsed = Math.round(Number.parseFloat(val) * 100);
  return BigInt(Number.isNaN(parsed) ? 0 : parsed);
}

export default function AdminShippingRatesPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();

  const [form, setForm] = useState<ShippingRatesForm>(DEFAULT_RATES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/admin" });
    }
  }, [identity, navigate]);

  useEffect(() => {
    if (!actor || actorFetching) return;
    setIsLoading(true);
    actor
      .getShippingRates()
      .then((rates: any) => {
        setForm({
          usEconomyBase: centsToDisplay(rates.usEconomyBase ?? BigInt(399)),
          usEconomyPerItem: centsToDisplay(
            rates.usEconomyPerItem ?? BigInt(209),
          ),
          usStandardBase: centsToDisplay(rates.usStandardBase ?? BigInt(475)),
          usStandardPerItem: centsToDisplay(
            rates.usStandardPerItem ?? BigInt(240),
          ),
          usExpressBase: centsToDisplay(rates.usExpressBase ?? BigInt(799)),
          usExpressPerItem: centsToDisplay(
            rates.usExpressPerItem ?? BigInt(240),
          ),
          canadaBase: centsToDisplay(rates.canadaBase ?? BigInt(939)),
          canadaPerItem: centsToDisplay(rates.canadaPerItem ?? BigInt(439)),
          australiaBase: centsToDisplay(rates.australiaBase ?? BigInt(1249)),
          australiaPerItem: centsToDisplay(
            rates.australiaPerItem ?? BigInt(499),
          ),
          restOfWorldBase: centsToDisplay(
            rates.restOfWorldBase ?? BigInt(1000),
          ),
          restOfWorldPerItem: centsToDisplay(
            rates.restOfWorldPerItem ?? BigInt(400),
          ),
        });
      })
      .catch(() => {
        // Use defaults if rates not yet saved
        setForm(DEFAULT_RATES);
      })
      .finally(() => setIsLoading(false));
  }, [actor, actorFetching]);

  if (!identity) return null;

  const handleChange = (key: keyof ShippingRatesForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!actor) {
      toast.error("Not connected — please try again");
      return;
    }
    setIsSaving(true);
    try {
      const rates = {
        usEconomyBase: displayToCents(form.usEconomyBase),
        usEconomyPerItem: displayToCents(form.usEconomyPerItem),
        usStandardBase: displayToCents(form.usStandardBase),
        usStandardPerItem: displayToCents(form.usStandardPerItem),
        usExpressBase: displayToCents(form.usExpressBase),
        usExpressPerItem: displayToCents(form.usExpressPerItem),
        canadaBase: displayToCents(form.canadaBase),
        canadaPerItem: displayToCents(form.canadaPerItem),
        australiaBase: displayToCents(form.australiaBase),
        australiaPerItem: displayToCents(form.australiaPerItem),
        restOfWorldBase: displayToCents(form.restOfWorldBase),
        restOfWorldPerItem: displayToCents(form.restOfWorldPerItem),
      };
      await (actor as any).setShippingRates(rates);
      toast.success("Shipping rates saved!");
    } catch (error) {
      console.error("Failed to save shipping rates:", error);
      toast.error("Failed to save shipping rates");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || actorFetching) {
    return (
      <div
        className="container py-12 flex items-center justify-center"
        data-ocid="shipping.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/admin" })}
        className="mb-6 -ml-2"
        data-ocid="shipping.secondary_button"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Truck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Shipping Rates</h1>
          <p className="text-sm text-muted-foreground">
            Set per-region rates based on Printify pricing
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rate Table</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table data-ocid="shipping.table">
            <TableHeader>
              <TableRow>
                <TableHead>Region / Method</TableHead>
                <TableHead>First Item ($)</TableHead>
                <TableHead>Each Additional ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RATE_ROWS.map((row, idx) => (
                <TableRow
                  key={row.baseKey}
                  data-ocid={`shipping.row.${idx + 1}`}
                >
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground text-sm">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form[row.baseKey]}
                        onChange={(e) =>
                          handleChange(row.baseKey, e.target.value)
                        }
                        className="w-24 h-8 text-sm"
                        data-ocid={`shipping.${row.baseKey}.input`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground text-sm">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form[row.perItemKey]}
                        onChange={(e) =>
                          handleChange(row.perItemKey, e.target.value)
                        }
                        className="w-24 h-8 text-sm"
                        data-ocid={`shipping.${row.perItemKey}.input`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              How shipping is calculated
            </p>
            <p className="text-xs">
              Shipping = First Item price + (quantity − 1) × Each Additional
              price. Alaska, Hawaii, and Puerto Rico ship via US rates with an
              additional 7–12 business days.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              data-ocid="shipping.save_button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Rates"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Label Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {RATE_ROWS.map((row) => (
                <div
                  key={row.baseKey}
                  className="flex justify-between border-b border-border pb-2"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-mono font-medium">
                    ${form[row.baseKey]} + ${form[row.perItemKey]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
