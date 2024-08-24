import {
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useContext,
} from "react";
import { useAccordion } from "../context";
import { useSyntheticListeners } from "../hooks";
import { classNames } from "../utils/css";
import { ValueContext } from "./accordion-item";

interface AccordionTriggerProps
  extends PropsWithChildren,
    Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...rest }, ref) => {
    const { activators } = useAccordion();
    const id = useContext(ValueContext) as string;

    const listeners = useSyntheticListeners(activators, id);

    return (
      <button
        ref={ref}
        className={classNames("bg-white bg-gray-800 w-[300px]", className)}
        {...listeners}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default AccordionTrigger;
