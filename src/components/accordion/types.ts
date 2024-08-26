import { MutableRefObject } from "react";

export type SyntheticEventName = keyof Omit<
  React.DOMAttributes<any>,
  "children" | "dangerouslySetInnerHTML"
>;

export type Trigger = {
  eventName: SyntheticEventName;
  handler: (event: React.SyntheticEvent) => boolean;
};

export type IdType = string;

export type SyntheticListener = {
  eventName: SyntheticEventName;
  handler: (event: React.SyntheticEvent, id: IdType) => void;
};

export interface Active {
  id: IdType;
}

export interface ValueType {
  id: IdType;
  node: MutableRefObject<HTMLElement | null>;
}
