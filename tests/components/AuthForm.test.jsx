import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import AuthForm from "@/components/auth/AuthForm";

vi.mock("@/components/ui/Toaster", () => ({ toast: vi.fn() }));

describe("AuthForm", () => {
  it("renders login mode fields and button", () => {
    const html = renderToString(<AuthForm mode="login" />);
    expect(html).toContain("Email or phone");
    expect(html).toContain("Password");
    expect(html).toContain("Sign in");
    expect(html).toContain('name="identifier"');
  });

  it("renders register mode fields and button", () => {
    const html = renderToString(<AuthForm mode="register" />);
    expect(html).toContain("Full name");
    expect(html).toContain("Email");
    expect(html).toContain("Password");
    expect(html).toContain("Create account");
    expect(html).toContain('name="full_name"');
    expect(html).toContain('name="email"');
  });

  it("renders requestReset mode", () => {
    const html = renderToString(<AuthForm mode="requestReset" />);
    expect(html).toContain("Send reset link");
    expect(html).toContain('name="email"');
  });

  it("renders confirmReset mode with the token", () => {
    const html = renderToString(<AuthForm mode="confirmReset" token="reset-abc" />);
    expect(html).toContain("New password");
    expect(html).toContain("Reset password");
    expect(html).toContain("reset-abc");
    expect(html).toContain('type="hidden"');
  });
});
