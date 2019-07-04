import { traverseObjects } from "./traverse";

export default function(schema, data) {
  /**
   * {prop: type} e.g.
   * {name: String}
   **/
  return traverseObjects(schema, data);
}
