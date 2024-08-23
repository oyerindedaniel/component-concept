import { useEffect, useLayoutEffect } from "react";

export const isClient = typeof window !== "undefined";

/**
 * A hook that resolves to useEffect on the server and useLayoutEffect on the client
 * @param callback {function} Callback function that is invoked when the dependencies of the hook change
 */
export const useIsomorphicLayoutEffect = isClient ? useLayoutEffect : useEffect;
