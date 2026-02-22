import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ContactForm } from '../backend';

export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (form: Omit<ContactForm, 'timestamp'>) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm({
        ...form,
        timestamp: BigInt(Date.now()),
      });
    },
  });
}

export function useGetContactForms() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactForm[]>({
    queryKey: ['contactForms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactForms();
    },
    enabled: !!actor && !isFetching,
  });
}
