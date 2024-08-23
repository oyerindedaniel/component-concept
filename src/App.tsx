import { useState } from "react";
import "./App.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/accordion/components/accordion";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="max-w-[300px]">
        <Accordion>
          <AccordionItem value="accordion-1">
            <AccordionTrigger className="bg-red-900">
              Trigger 1
            </AccordionTrigger>
            <AccordionContent>Trigger content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="accordion-2">
            <AccordionTrigger>Trigger 2</AccordionTrigger>
            <AccordionContent>
              Trigger content
              2hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="accordion-3">
            <AccordionTrigger>Trigger 3</AccordionTrigger>
            <AccordionContent>Trigger content 3</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

export default App;
