import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { useLatestValue } from "../../../hooks";
import { defaultTriggers } from "../constants";
import { useCombineActivators } from "../hooks";
import { Active, IdType, SyntheticListener } from "../types";
import AccordionContent from "./accordion-content";
import AccordionItem from "./accordion-item";
import AccordionTrigger from "./accordion-trigger";

interface ValueType {
  id: IdType;
  node: MutableRefObject<HTMLElement | null>;
}

type AccordionMap = Map<IdType, ValueType>;

interface AccordionProps extends PropsWithChildren {
  type?: "single" | "multiple";
}

export interface AccordionContextType {
  accordionItems: AccordionMap;
  active: Active | null;
  activators: SyntheticListener[];
}

export const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

const AccordionProvider: React.FC<AccordionProps> = ({
  type = "single",
  children,
}) => {
  const accordionItems: AccordionMap = useMemo(
    () => new Map<IdType, ValueType>(),
    []
  );
  const [active, setActive] = useState<Active | null>(null);
  const activeIdRef = useLatestValue(active);

  function getSyntheticHandler(
    handler: (event: React.SyntheticEvent) => boolean
  ): SyntheticListener["handler"] {
    return (event: React.SyntheticEvent, id: IdType) => {
      console.log(event, id, accordionItems.get(id));

      const node = accordionItems.get(id)?.node;

      setActive((prev) => (prev?.id === id ? null : { id }));
    };
  }

  const activators = useCombineActivators(defaultTriggers, getSyntheticHandler);

  const contextValue = useMemo(
    () => ({
      accordionItems,
      active,
      activators,
    }),
    [accordionItems, active, activators]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className="flex flex-col gap-5">{children}</div>
    </AccordionContext.Provider>
  );
};

const Accordion = AccordionProvider;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
