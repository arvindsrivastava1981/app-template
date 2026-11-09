"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Settings as SettingsIcon, ShieldCheck, Mail, User, LogOut } from "lucide-react";
import { getCurrentUserClient } from "@/lib/auth/current-user";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import { toast } from "@/components/ui/Toaster";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required."),
  new_password: z.string().min(8, "New password must be at least 8 characters."),
  confirm_password: z.string().min(1, "Please confirm your new password."),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match.",
  path: ["confirm_password"],
});

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const ctx = await getCurrentUserClient();
  if (!ctx) return null;

  const [activeTab, setActiveTab] = useState("profile");
  const [profilePending, setProfilePending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: ctx.user.full_name || "", email: ctx.user.email },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  async function handleProfileUpdate(data) {
    setProfilePending(true);
    try {
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: data.full_name, email: data.email }),
      });
      const result = await res.json();
      if (res.ok) {
        toast("Profile updated successfully.", "success");
        profileForm.reset({ full_name: data.full_name, email: data.email });
      } else {
        toast(result.error || "Failed to update profile.", "error");
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setProfilePending(false);
    }
  }

  async function handlePasswordChange(data) {
    setPasswordPending(true);
    try {
      const res = await fetch("/api/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: data.current_password, new_password: data.new_password }),
      });
      const result = await res.json();
      if (res.ok) {
        toast("Password updated successfully.", "success");
        passwordForm.reset();
      } else {
        toast(result.error || "Failed to update password.", "error");
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setPasswordPending(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" } });
      window.location.assign("/login");
    } catch {
      window.location.assign("/login");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Manage your account"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <nav className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-600 text-white"
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <ShieldCheck className="h-4 w-4" />
            Password
          </button>
        </nav>

        <div className="lg:col-span-2 space-y-6">
          {activeTab === "profile" && (
            <Card className="p-5">
              <PageHeader icon={User} title="Profile" subtitle="Update your personal information" />
              <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Full Name</label>
                  <input {...profileForm.register("full_name")} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400" />
                  {profileForm.formState.errors.full_name && <p className="text-xs text-red-600 dark:text-red-400">{profileForm.formState.errors.full_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Email</label>
                  <input {...profileForm.register("email")} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400" />
                  {profileForm.formState.errors.email && <p className="text-xs text-red-600 dark:text-red-400">{profileForm.formState.errors.email.message}</p>}
                </div>
                <button type="submit" disabled={profilePending} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-emerald-700">{profilePending ? "Saving..." : "Save Changes"}</button>
              </form>
            </Card>
          )}

          {activeTab === "password" && (
            <Card className="p-5">
              <PageHeader icon={ShieldCheck} title="Change Password" subtitle="Update your account password" />
              <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Current Password</label>
                  <input {...passwordForm.register("current_password")} type="password" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">New Password</label>
                  <input {...passwordForm.register("new_password")} type="password" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Confirm New Password</label>
                  <input {...passwordForm.register("confirm_password")} type="password" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400" />
                </div>
                <button type="submit" disabled={passwordPending} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-emerald-700">{passwordPending ? "Updating..." : "Change Password"}</button>
              </form>
            </Card>
          )}

          <Card className="border-red-200 dark:border-red-900/30 p-5">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Sign Out</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Signing out will end your current session.</p>
            <button onClick={handleLogout} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Sign Out</button>
          </Card>
        </div>
      </div>
    </div>
  );
}