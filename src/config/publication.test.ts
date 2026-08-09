import { describe, expect, it } from "vitest";
import {
  isRouteIndexable,
  isRouteVisible,
  routePublication,
} from "./publication";

describe("publication state", () => {
  it("keeps hidden routes out of public navigation and indexing", () => {
    const routes = Object.keys(routePublication) as Array<
      keyof typeof routePublication
    >;
    expect(routes.filter(isRouteVisible)).toHaveLength(routes.length);
    expect(routes.filter(isRouteIndexable)).toHaveLength(routes.length);
  });
});
