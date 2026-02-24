import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { NewsletterSubscriber } from '../backend';

export function useNewsletterSignup() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.subscribeToNewsletter(email);
    },
  });
}

export function useGetNewsletterSubscribers() {
  const { actor, isFetching } = useActor();

  return useQuery<NewsletterSubscriber[]>({
    queryKey: ['newsletterSubscribers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewsletterSubscribers();
    },
    enabled: !!actor && !isFetching,
  });
}
