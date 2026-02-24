import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SocialLinks } from '../backend';

export function useGetSocialLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SocialLinks | null>({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSocialLinks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetSocialLinks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (links: SocialLinks) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setSocialLinks(links);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
    },
  });
}
