import { describe, expect, it } from "vitest";
import { validateInquiry } from "./forms";
describe("inquiry validation", () => {
  it("requires meaningful input", () =>
    expect(
      Object.keys(
        validateInquiry({ name: "", email: "bad", message: "short" }),
      ),
    ).toEqual(["name", "email", "message"]));
  it("accepts valid input", () =>
    expect(
      validateInquiry({
        name: "Asha",
        email: "asha@example.com",
        message: "A dinner for twelve.",
      }),
    ).toEqual({}));
});
