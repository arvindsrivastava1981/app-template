import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import AuthShell from "@/components/auth/AuthShell";

describe("AuthShell", () => {
  it("renders title, subtitle, app name, privacy note and children", () => {
    const html = renderToString(
      <AuthShell title="Welcome back" subtitle="Sign in to your account" showPrivacy>
        <button>Sign in</button>
      </AuthShell>
    );
    expect(html).toContain("Welcome back");
    expect(html).toContain("Sign in to your account");
    expect(html).toContain("App Template");
    expect(html).toContain("Your data stays private");
    expect(html).toContain("Sign in");
  });

  it("omits the privacy note when showPrivacy is false", () => {
    const html = renderToString(<AuthShell title="X" />);
    expect(html).not.toContain("Your data stays private");
  });
});
