import { useCallback, useRef } from "react";

import { useIsomorphicLayoutEffect } from "./use-isometric-effect";

export function useEvent<T extends Function>(handler: T | undefined) {
  const handlerRef = useRef<T | undefined>(handler);

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback(function (...args: any) {
    return handlerRef.current?.(...args);
  }, []);
}
