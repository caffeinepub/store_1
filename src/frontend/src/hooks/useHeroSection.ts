import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HeroSection } from "../backend";
import { useActor } from "./useActor";

export function useGetHeroSection() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HeroSection | null>({
    queryKey: ["heroSection"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getHeroSection();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetHeroSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: HeroSection) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setHeroSection(section);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroSection"] });
    },
  });
}
