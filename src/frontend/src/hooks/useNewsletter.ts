import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useNewsletterSignup() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      // Store newsletter signup - backend would need to add this function
      // For now, we'll use a workaround with contact form
      return actor.submitContactForm({
        name: 'Newsletter Subscriber',
        email,
        message: 'Newsletter signup',
        timestamp: BigInt(Date.now()),
      });
    },
  });
}
