function composeEventHandlers<T>(
  originalEventHandler?: (event: T) => void,
  ourEventHandler?: (event: T) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: T) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export { composeEventHandlers };
