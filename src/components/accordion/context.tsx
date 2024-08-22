import { AccordionContextType } from "./components/accordion";
import { AccordionContext } from "./components/accordion";
import { useContext } from "react";

export const useAccordion = (): AccordionContextType => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within a AccordionProvider");
  }
  return context;
};
