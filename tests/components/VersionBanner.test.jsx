import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import VersionBanner from "@/components/ui/VersionBanner";

describe("VersionBanner", () => {
  it("renders nothing on the server when there is no stored previous version", () => {
    const html = renderToString(<VersionBanner />);
    expect(html).toBe("");
  });
});
