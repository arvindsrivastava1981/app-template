import { describe, it, expect } from "vitest";
import { cn } from "@/components/ui/utils";

describe("cn", () => {
  it("joins non-falsey classes", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("omits undefined, null and false values", () => {
    expect(cn("a", undefined, null, false, "b")).toBe("a b");
  });

  it("handles an empty input", () => {
    expect(cn()).toBe("");
  });
});
