import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import Card from "@/components/ui/Card";

describe("Card", () => {
  it("renders children with default variant classes", () => {
    const html = renderToString(<Card>hello world</Card>);
    expect(html).toContain("hello world");
    expect(html).toContain("border-zinc-200");
    expect(html).toContain("bg-white");
    expect(html).toContain("rounded-xl");
    expect(html).toContain("shadow-sm");
  });

  it("applies variant classes", () => {
    expect(renderToString(<Card variant="danger">x</Card>)).toContain("border-red-200");
    expect(renderToString(<Card variant="success">x</Card>)).toContain("border-emerald-200");
    expect(renderToString(<Card variant="warning">x</Card>)).toContain("border-amber-200");
  });

  it("applies interactive class when interactive is true", () => {
    const html = renderToString(<Card interactive>x</Card>);
    expect(html).toContain("transition");
    expect(html).toContain("hover:border-emerald-300");
  });

  it("renders a custom element via the `as` prop", () => {
    const html = renderToString(<Card as="section">x</Card>);
    expect(html.startsWith("<section")).toBe(true);
    expect(html).toContain("</section>");
  });
});
