// Migration shim: wraps @caffeineai/core-infrastructure's useActor with the
// project-specific createActor function from backend.ts, so all existing hooks
// that call useActor() with no arguments continue to work unchanged.
import { useActor as useActorBase } from "@caffeineai/core-infrastructure";
import { type backendInterface, createActor } from "../backend";

export function useActor(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useActorBase(createActor) as any;
}
