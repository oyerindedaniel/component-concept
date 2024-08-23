import { useMemo } from "react";
import { Trigger } from "../types";
import { SyntheticListener } from "../types";

export function useCombineActivators(
  triggers: Trigger[],
  getSyntheticHandler: (
    handler: Trigger["handler"]
  ) => SyntheticListener["handler"]
): SyntheticListener[] {
  return useMemo(
    () =>
      triggers.reduce<SyntheticListener[]>((accumulator, trigger) => {
        const triggerActivator: SyntheticListener = {
          eventName: trigger.eventName,
          handler: getSyntheticHandler(trigger.handler),
        };

        return [...accumulator, triggerActivator];
      }, []),
    [triggers, getSyntheticHandler]
  );
}
