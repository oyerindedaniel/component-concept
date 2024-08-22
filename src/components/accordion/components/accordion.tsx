import React, {
  createContext,
  useState,
  useCallback,
  PropsWithChildren,
  useMemo,
} from "react";
import AccordionItem from "./accordion-item";

type IdType = string;

interface ValueType {
  id: IdType;
  isActive: boolean;
}

type AccordionMap = Map<IdType, ValueType>;

interface AccordionProps extends PropsWithChildren {
  type?: "single";
}

export interface AccordionContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  accordionItems: AccordionMap;
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prevState) => !prevState);
  }, []);

  const contextValue = useMemo(
    () => ({
      isCollapsed,
      toggleCollapse,
      accordionItems,
    }),
    [accordionItems, isCollapsed, toggleCollapse]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      {children}
    </AccordionContext.Provider>
  );
};

const Accordion = AccordionProvider;

export { Accordion, AccordionItem };
