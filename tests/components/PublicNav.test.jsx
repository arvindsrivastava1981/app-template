import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import PublicNav from "@/components/layout/PublicNav";

describe("PublicNav", () => {
  it("renders Sign in and Signup links", () => {
    const html = renderToString(<PublicNav />);
    expect(html).toContain("Sign in");
    expect(html).toContain("Signup");
    expect(html).toContain('href="/login"');
    expect(html).toContain('href="/register"');
  });
});
