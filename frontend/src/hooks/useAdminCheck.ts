import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

/**
 * Hook to check if the currently authenticated user is an admin.
 * Only runs the check when the user is authenticated (identity is available)
 * and the actor is ready. Never runs for anonymous/unauthenticated users.
 *
 * On first login (bootstrap scenario), the backend auto-assigns admin to the
 * first caller. We invalidate the query whenever the identity changes so the
 * freshly-bootstrapped admin status is always reflected immediately.
 */
export function useAdminCheck() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const principalStr = identity?.getPrincipal().toString() ?? null;

  // Track the previous principal so we can invalidate when it changes
  const prevPrincipalRef = useRef<string | null>(null);

  useEffect(() => {
    if (principalStr && prevPrincipalRef.current !== principalStr) {
      // Principal just changed (new login) — invalidate any cached admin check
      // so the query runs fresh against the (possibly just-bootstrapped) backend
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      prevPrincipalRef.current = principalStr;
    }
    if (!principalStr) {
      prevPrincipalRef.current = null;
    }
  }, [principalStr, queryClient]);

  const query = useQuery<boolean>({
    // Include principal in key so a new query is created for each identity
    queryKey: ['isCallerAdmin', principalStr],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    // Only run when: user is authenticated, actor is ready, and auth is not initializing
    enabled: isAuthenticated && !!actor && !actorFetching && !isInitializing,
    retry: 2,
    // No staleTime — always fetch fresh so bootstrap admin is detected immediately
    staleTime: 0,
    refetchOnMount: true,
  });

  return {
    ...query,
    isAdmin: query.data ?? false,
    isLoading: actorFetching || query.isLoading || isInitializing,
    isFetched: isAuthenticated && query.isFetched,
  };
}
