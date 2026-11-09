import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import PageHeader from "@/components/layout/PageHeader";
import { LayoutDashboard } from "lucide-react";

describe("PageHeader", () => {
  it("renders title, subtitle and icon", () => {
    const html = renderToString(
      <PageHeader icon={LayoutDashboard} title="Dashboard" subtitle="Welcome back to your account" />
    );
    expect(html).toContain("Dashboard");
    expect(html).toContain("Welcome back to your account");
    expect(html).toContain("lucide"); // icon renders SVG
  });

  it("renders without an icon", () => {
    const html = renderToString(<PageHeader title="Only title" />);
    expect(html).toContain("Only title");
    expect(html).not.toContain("undefined");
  });

  it("omits subtitle when not provided", () => {
    const html = renderToString(<PageHeader title="Only title" />);
    expect(html).not.toContain("subtitle");
  });
});
