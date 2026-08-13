import { describe, expect, it } from "vitest";
import { parseFirstPartyEvent } from "./schema";

const valid = {
  eventName: "click_call",
  visitorId: "550e8400-e29b-41d4-a716-446655440000",
  sessionId: "6ba7b810-9dad-41d1-80b4-00c04fd430c8",
  sourcePage: "/catering",
  ctaLocation: "page_content",
};

describe("first-party analytics event schema", () => {
  it("accepts the shared event taxonomy", () => {
    expect(parseFirstPartyEvent(valid)).toEqual(valid);
  });

  it("ignores extra fields and rejects arbitrary events or query strings", () => {
    expect(
      parseFirstPartyEvent({ ...valid, email: "guest@example.com" }),
    ).toEqual(valid);
    expect(
      parseFirstPartyEvent({ ...valid, eventName: "form_content" }),
    ).toBeNull();
    expect(
      parseFirstPartyEvent({ ...valid, sourcePage: "/catering?email=x" }),
    ).toBeNull();
  });
});
