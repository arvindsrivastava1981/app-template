import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ResetPasswordFromUrl, VerifyEmailFromUrl } from "@/components/auth/TokenAuthClient";

const mockUseSearchParams = vi.hoisted(() => vi.fn(() => new URLSearchParams("token=abc123")));

vi.mock("next/navigation", () => ({
  useSearchParams: mockUseSearchParams,
}));

beforeEach(() => {
  mockUseSearchParams.mockReturnValue(new URLSearchParams("token=abc123"));
});

describe("TokenAuthClient", () => {
  it("renders ResetPasswordFromUrl as a confirmReset form when a token is present", () => {
    const html = renderToString(<ResetPasswordFromUrl />);
    expect(html).toContain("New password");
    expect(html).toContain("Reset password");
    expect(html).toContain("abc123");
  });

  it("renders VerifyEmailFromUrl loading state", () => {
    const html = renderToString(<VerifyEmailFromUrl />);
    expect(html).toContain("animate-spin");
  });

  it("renders an invalid-token message when no token is present", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    const html = renderToString(<ResetPasswordFromUrl />);
    expect(html).toContain("Invalid or missing reset token");
  });
});
