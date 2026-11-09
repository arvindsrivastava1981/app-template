import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import Sidebar from "@/components/layout/Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/app"),
  Link: ({ children, ...props }) => React.createElement("a", props, children),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Sidebar", () => {
  it("renders user name, app name, nav links and logout button", () => {
    const html = renderToString(<Sidebar userName="Ada Lovelace" appName="My App" />);
    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("My App");
    expect(html).toContain("Dashboard");
    expect(html).toContain("Settings");
    expect(html).toContain("Logout");
    expect(html).toContain('href="/app"');
    expect(html).toContain('href="/app/settings"');
  });

  it("falls back to 'User' when no name is provided", () => {
    const html = renderToString(<Sidebar />);
    expect(html).toContain("User");
  });
});
