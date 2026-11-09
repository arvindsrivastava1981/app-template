import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import VerifyEmailClient from "@/components/auth/VerifyEmailClient";

describe("VerifyEmailClient", () => {
  it("renders a loading spinner while verification is in flight", () => {
    const html = renderToString(<VerifyEmailClient token="abc123" />);
    expect(html).toContain("animate-spin");
  });
});
