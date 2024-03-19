export type ConditionQuery =
  | "contains"
  | "startswith"
  | "endswith"
  | "substringof"
  | "eq"
  | "le"
  | "lt"
  | "ge"
  | "gt"
  | "ge"
  | "ne";
export type ConditionOperator = "and" | "or";

export type QueryOptionAPI = {
  orderby?: string;
  skip?: number;
  top?: number;
  filter?: string;
};
