import { useQuery } from "@tanstack/react-query";
import type { Product } from "../backend";
import { useActor } from "./useActor";

export function useCalculateShipping(destination: string, products: Product[]) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["shipping", destination, products.length],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.calculateShipping(destination, products);
    },
    enabled: !!actor && !isFetching && !!destination && products.length > 0,
  });
}
