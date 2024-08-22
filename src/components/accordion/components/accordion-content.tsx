import { forwardRef, PropsWithChildren, HTMLAttributes } from "react";
import { classNames } from "../utils/css";

interface AccordionContentProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames("p-4 bg-white text-gray-800", className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default AccordionContent;
