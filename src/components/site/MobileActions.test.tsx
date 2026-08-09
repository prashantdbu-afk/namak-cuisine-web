import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileActions } from "./MobileActions";

describe("mobile actions", () => {
  it("renders one combined call reservation action in call mode", () => {
    render(<MobileActions />);
    expect(
      screen.getByRole("link", { name: "Call to Reserve" }),
    ).toHaveAttribute("href", "tel:+12147300047");
    expect(screen.queryByRole("link", { name: "Reserve" })).toBeNull();
  });
});
