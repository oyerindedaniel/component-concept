import React from "react";
import { PropsWithChildren } from "react";
import { useAccordion } from "../context";
import { useIsomorphicLayoutEffect } from "../../../hooks/use-isometric-effect";

interface AccordionItemProps extends PropsWithChildren {
  value: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ value, children }) => {
  const { accordionItems } = useAccordion();

  useIsomorphicLayoutEffect(
    () => {
      accordionItems.set(value, {
        id: value,
        isActive: false,
      });

      return () => {
        const item = accordionItems.get(value);
        if (item && item.id === value) {
          accordionItems.delete(value);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accordionItems, value]
  );

  return <div>{children}</div>;
};

export default AccordionItem;
