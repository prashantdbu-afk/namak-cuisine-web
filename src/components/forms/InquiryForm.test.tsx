import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InquiryForm } from "./InquiryForm";

describe("disabled inquiry mode", () => {
  it("never presents editable fields or a non-delivering send button", () => {
    render(<InquiryForm />);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button", { name: /send/i })).toBeNull();
    expect(
      screen.getByRole("link", { name: /call 214-730-0047/i }),
    ).toHaveAttribute("href", "tel:+12147300047");
  });
});
