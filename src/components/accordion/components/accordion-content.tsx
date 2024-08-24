import {
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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

    const present = active?.id === id;

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
        className={classNames(
          "content text-sm overflow-hidden w-full rounded-lg break-words whitespace-normal text-left transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
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

export default AccordionContent;
