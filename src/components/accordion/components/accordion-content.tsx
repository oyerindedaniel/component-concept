import {
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useContext,
  useRef,
} from "react";
import { useCombinedRefs } from "../../../hooks";
import { useAccordion } from "../context";
import { classNames } from "../utils/css";
import { ValueContext } from "./accordion-item";

interface AccordionContentProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...rest }, forwardedRef) => {
    const id = useContext(ValueContext) as string;
    const { active } = useAccordion();

    const accordionRef = useRef<HTMLInputElement>(null);

    const combinedRef = useCombinedRefs(accordionRef, forwardedRef);

    const isActiveAccordion = active?.id === id;

    return (
      <div
        ref={combinedRef}
        data-state={isActiveAccordion ? "open" : "closed"}
        className={classNames(
          "content text-sm overflow-hidden rounded-lg break-words whitespace-normal text-left data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default AccordionContent;

//
