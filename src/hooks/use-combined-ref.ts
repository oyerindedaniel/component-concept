import { useMemo } from "react";

export function useCombinedRefs<T>(
  ...refs: React.Ref<T>[]
): React.RefCallback<T> {
  return useMemo(
    () => (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref && typeof ref === "object") {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
