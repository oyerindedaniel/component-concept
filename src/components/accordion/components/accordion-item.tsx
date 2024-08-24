import React, { createContext, HTMLProps, PropsWithChildren } from "react";
import { useIsomorphicLayoutEffect, useNodeRef } from "../../../hooks";
import { useAccordion } from "../context";
import { classNames } from "../utils/css";

interface AccordionItemProps
  extends PropsWithChildren<HTMLProps<HTMLDivElement>> {
  value: string;
}

export const ValueContext = createContext<string | undefined>(undefined);

const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  className,
  children,
}) => {
  const { accordionItems } = useAccordion();
  const [node, setNodeRef] = useNodeRef(
    (newElement: HTMLElement | null, previousElement: HTMLElement | null) => {
      if (newElement) {
        const accordionContent = newElement.querySelector(".content");

        // if (accordionContent) {
        //   const contentElement = accordionContent as HTMLElement;
        //   const accordionContentHeight = contentElement.scrollHeight;
        //   contentElement.style.setProperty(
        //     "--accordion-content-height",
        //     `${accordionContentHeight}px`
        //   );
        // }
      }
    }
  );

  useIsomorphicLayoutEffect(
    () => {
      accordionItems.set(value, {
        id: value,
        node,
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

  return (
    <div
      ref={setNodeRef}
      className={classNames("flex flex-col gap-1", className)}
    >
      <ValueContext.Provider value={value}>{children}</ValueContext.Provider>
    </div>
  );
};

export default AccordionItem;
