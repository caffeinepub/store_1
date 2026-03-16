import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnnouncementBanner, Product } from "../backend";
import { ProductStatus } from "../backend";
import type { backendInterface as BackendInterface } from "../backend.d";
import { useActor } from "./useActor";

export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAnnouncementBanner() {
  const { actor, isFetching } = useActor();

  return useQuery<AnnouncementBanner | null>({
    queryKey: ["announcementBanner"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnnouncementBanner();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetAnnouncementBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (banner: AnnouncementBanner) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setAnnouncementBanner(banner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcementBanner"] });
    },
  });
}

export { ProductStatus };

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useReorderProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      if (!actor) throw new Error("Actor not available");
      return actor.reorderProducts(orderedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useSetProductFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setProductFeatured(id, featured);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useSetProductStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ProductStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setProductStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useGetAllProductBulletPoints() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["productBulletPoints"],
    queryFn: () =>
      (actor as unknown as BackendInterface).getAllProductBulletPoints(),
    enabled: !!actor,
  });
}

export function useSetProductBulletPoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, points }: { id: string; points: string[] }) =>
      (actor as unknown as BackendInterface).setProductBulletPoints(id, points),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productBulletPoints"] });
    },
  });
}
