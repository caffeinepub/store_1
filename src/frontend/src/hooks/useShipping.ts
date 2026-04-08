import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

// Shipping calculation hook — kept for potential future use.
// The storefront uses free shipping so this is not called from the checkout UI.
export function useCalculateShipping(
  destination: string,
  method: string,
  itemCount: number,
) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["shipping", destination, method, itemCount],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.calculateShipping(destination, method, BigInt(itemCount));
    },
    enabled:
      !!actor && !isFetching && !!destination && !!method && itemCount > 0,
  });
}
