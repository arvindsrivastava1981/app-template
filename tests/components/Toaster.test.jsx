import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ToasterProvider } from "@/components/ui/Toaster";

describe("ToasterProvider", () => {
  it("renders its children and the toast container", () => {
    const html = renderToString(
      <ToasterProvider><span>child content</span></ToasterProvider>
    );
    expect(html).toContain("child content");
    expect(html).toContain("aria-live");
  });
});
