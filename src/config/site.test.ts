import { describe,expect,it } from "vitest"; import { navigation } from "./site";
describe("navigation",()=>{it("contains unique, valid routes",()=>{expect(new Set(navigation.map(x=>x.href)).size).toBe(navigation.length);expect(navigation.every(x=>x.href.startsWith("/"))).toBe(true)})});
