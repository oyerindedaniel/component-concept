import React, {
  createContext,
  forwardRef,
  HTMLAttributes,
  HTMLProps,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useCombinedRefs,
  useIsomorphicLayoutEffect,
  useNodeRef,
} from "../../../hooks";
import { useAccordion } from "../context";
import { useCombineActivators, useSyntheticListeners } from "../hooks";
import { classNames } from "../utils/css";

import { useLatestValue } from "../../../hooks";
import { defaultAccordionContext, defaultTriggers } from "../constants";
import { Active, IdType, SyntheticListener, ValueType } from "../types";

type AccordionMap = Map<IdType, ValueType>;

interface AccordionProps extends PropsWithChildren {
  type?: "single" | "multiple";
}

export interface AccordionContextType {
  accordionItems: AccordionMap;
  active: Active[];
  activators: SyntheticListener[];
}

export const AccordionContext = createContext<AccordionContextType>(
  defaultAccordionContext
);

const AccordionProvider: React.FC<AccordionProps> = ({
  type = "single",
  children,
}) => {
  const accordionItems: AccordionMap = useMemo(
    () => new Map<IdType, ValueType>(),
    []
  );

  const [active, setActive] = useState<Active[]>([]);
  const activeRef = useLatestValue(active);

  function getSyntheticHandler(
    handler: (event: React.SyntheticEvent) => boolean
  ): SyntheticListener["handler"] {
    return (event: React.SyntheticEvent, id: IdType) => {
      const node = accordionItems.get(id)?.node;

      const isClick = handler(event);

      if (isClick) {
        setActive((prev) => toggleActiveState(prev, id, type));
      }
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

interface AccordionTriggerProps
  extends PropsWithChildren,
    Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...rest }, ref) => {
    const { activators, active } = useAccordion();

    const id = useContext(ValueContext) as string;

    const isActive = isItemActive(active, id);

    const listeners = useSyntheticListeners(activators, id);

    return (
      <button
        id={`accordion-trigger-${id}`}
        ref={ref}
        aria-controls={`accordion-content-${id}`}
        aria-expanded={isActive}
        className={classNames("bg-white bg-gray-800 w-[300px]", className)}
        {...listeners}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

interface AccordionContentProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...rest }, forwardedRef) => {
    const id = useContext(ValueContext) as string;
    const { active } = useAccordion();

    const present = isItemActive(active, id);

    const accordionRef = useRef<HTMLDivElement>(null);
    const [isPresent, setIsPresent] = useState(present);

    const isOpen = present || isPresent;
    const isMountAnimationPreventedRef = useRef(isOpen);

    const originalStylesRef = useRef<Record<string, string>>();
    const heightRef = useRef<number | undefined>(0);
    const widthRef = useRef<number | undefined>(0);

    useEffect(() => {
      const rAF = requestAnimationFrame(
        () => (isMountAnimationPreventedRef.current = false)
      );
      return () => cancelAnimationFrame(rAF);
    }, []);

    useLayoutEffect(() => {
      const node = accordionRef.current;
      if (node) {
        originalStylesRef.current = originalStylesRef.current || {
          transitionDuration: node.style.transitionDuration,
          animationName: node.style.animationName,
        };

        node.style.transitionDuration = "0s";
        node.style.animationName = "none";

        const rect = node.getBoundingClientRect();
        heightRef.current = rect.height;
        widthRef.current = rect.width;

        if (!isMountAnimationPreventedRef.current) {
          node.style.transitionDuration =
            originalStylesRef.current.transitionDuration;
          node.style.animationName = originalStylesRef.current.animationName;
        }

        setIsPresent(present);
      }
    }, [present]);

    const combinedRef = useCombinedRefs(accordionRef, forwardedRef);

    return (
      <div
        ref={combinedRef}
        data-state={isOpen ? "open" : "closed"}
        role="region"
        id={`accordion-content-${id}`}
        aria-labelledby={`accordion-trigger-${id}`}
        aria-hidden={!isOpen}
        className={classNames(
          "content text-sm overflow-hidden w-full rounded-lg break-words duration-500 whitespace-normal text-left transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          className
        )}
        style={{
          [`--accordion-content-height` as any]: heightRef.current
            ? `${heightRef.current}px`
            : undefined,
          [`--accordion-content-width` as any]: widthRef.current
            ? `${widthRef.current}px`
            : undefined,
        }}
        {...rest}
      >
        {isOpen && children}
      </div>
    );
  }
);

const Accordion = AccordionProvider;

function isItemActive(active: Active[], id: IdType): boolean {
  return active.some((item) => item.id === id);
}

function toggleActiveState(
  prev: Active[],
  id: IdType,
  type: "single" | "multiple"
): Active[] {
  const isAlreadyActive = prev.some((item) => item.id === id);

  if (type === "single") {
    return isAlreadyActive ? [] : [{ id }];
  } else {
    return isAlreadyActive
      ? prev.filter((item) => item.id !== id)
      : [...prev, { id }];
  }
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
