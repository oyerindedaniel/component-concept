import { AccordionContextType } from "./components/accordion";
import { IdType, SyntheticEventName, Trigger, ValueType } from "./types";

// Array of default triggers
export const defaultTriggers: Trigger[] = [
  {
    eventName: "onClick",
    handler: (event: React.SyntheticEvent) => {
      return event.type === "click";
    },
  },
];

export const isValidTrigger = (event: React.SyntheticEvent): boolean => {
  const trigger = defaultTriggers.find(
    (t) =>
      t.eventName ===
      (`on${
        event.type.charAt(0).toUpperCase() + event.type.slice(1)
      }` as SyntheticEventName)
  );

  return trigger ? (trigger.handler ? trigger.handler(event) : true) : false;
};

export const defaultAccordionContext: AccordionContextType = {
  accordionItems: new Map<IdType, ValueType>(),
  active: [{ id: "" }],
  activators: [],
};
