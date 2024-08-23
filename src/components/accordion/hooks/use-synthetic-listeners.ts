import { useMemo } from "react";

import { IdType, SyntheticListener } from "../types";

export type SyntheticListenerMap = Record<string, Function>;

export function useSyntheticListeners(
  listeners: SyntheticListener[],
  id: IdType
): SyntheticListenerMap {
  return useMemo(() => {
    return listeners.reduce<SyntheticListenerMap>(
      (acc, { eventName, handler }) => {
        acc[eventName] = (event: React.SyntheticEvent) => {
          handler(event, id);
        };

        return acc;
      },
      {} as SyntheticListenerMap
    );
  }, [listeners, id]);
}
