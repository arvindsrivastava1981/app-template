import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import AdminSidebar from "@/components/layout/AdminSidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/admin"),
  Link: ({ children, ...props }) => React.createElement("a", props, children),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminSidebar", () => {
  it("renders admin name, app name, nav links, admin badge and logout", () => {
    const html = renderToString(<AdminSidebar userName="Ada Lovelace" appName="Admin App" />);
    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("Admin App");
    expect(html).toContain("ADMIN");
    expect(html).toContain("Dashboard");
    expect(html).toContain("User Management");
    expect(html).toContain("Logout");
    expect(html).toContain('href="/admin"');
    expect(html).toContain('href="/admin/users"');
  });

  it("falls back to 'Admin' when no name is provided", () => {
    const html = renderToString(<AdminSidebar />);
    expect(html).toContain("Admin");
  });
});
