import { checkObjectSchema } from "./traverse";

export default function(schema, data) {
  /**
   * {prop: type} e.g.
   * {name: String}
   **/
  return checkObjectSchema(schema, data);
}
