import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order, Product, Address, ShippingOption } from '../backend';

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrder(orderId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      products,
      total,
      shippingAddress,
      shippingOption,
    }: {
      products: Product[];
      total: bigint;
      shippingAddress: Address;
      shippingOption: ShippingOption;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(products, total, shippingAddress, shippingOption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useUpdateOrderCost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, cost }: { orderId: string; cost: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderCost(orderId, cost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}
