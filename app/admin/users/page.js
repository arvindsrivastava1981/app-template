"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Trash2, Edit, Mail } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import { toast } from "@/components/ui/Toaster";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ email: "", full_name: "", role: "user", password: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setUsers(data.users);
      } else {
        toast(data.error || "Failed to load users.", "error");
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm({ email: "", full_name: "", role: "user", password: "" });
    setOpenModal("create");
  }

  function openEdit(user) {
    setEditingId(user.id);
    setForm({ email: user.email, full_name: user.full_name, role: user.role || "user", password: "" });
    setOpenModal("edit");
  }

  function closeModal() {
    setOpenModal(null);
    setEditingId(null);
    setForm({ email: "", full_name: "", role: "user", password: "" });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editingId, ...form }),
        });
        const data = await res.json();
        if (res.ok) {
          toast("User updated successfully.", "success");
          closeModal();
          loadUsers();
        } else {
          toast(data.error || "Failed to update user.", "error");
        }
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          toast("User created successfully.", "success");
          closeModal();
          loadUsers();
        } else {
          toast(data.error || "Failed to create user.", "error");
        }
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("User deleted successfully.", "success");
        loadUsers();
      } else {
        const data = await res.json();
        toast(data.error || "Failed to delete user.", "error");
      }
    } catch {
      toast("Network error. Please try again.", "error");
    }
  }

  const roleLabel = (role) => (role === "admin" ? "Admin" : "User");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader icon={Users} title="User Management" subtitle="Create and manage all application users" />
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <UserPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="pb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Name</th>
                <th className="pb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Email</th>
                <th className="pb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Role</th>
                <th className="pb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Verified</th>
                <th className="pb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-zinc-200 dark:border-zinc-800">
                  <td className="py-3 text-sm text-zinc-900 dark:text-zinc-100">{u.full_name || "—"}</td>
                  <td className="py-3 text-sm text-zinc-900 dark:text-zinc-100">{u.email}</td>
                  <td className="py-3 text-sm">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.role === "admin" ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                      {roleLabel(u.role || "user")}
                    </span>
                  </td>
                  <td className="py-3 text-sm">{u.is_email_verified ? <span className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Mail className="h-3 w-3" /> Verified</span> : <span className="text-xs text-zinc-500 dark:text-zinc-500">Pending</span>}</td>
                  <td className="py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" title="Edit user"><Edit className="h-4 w-4" /></button>
                      {u.id !== "a1111111-1111-1111-1111-111111111111" && (
                        <button onClick={() => handleDelete(u.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20" title="Delete user"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{editingId ? "Edit User" : "Create User"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Full Name</label>
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400" required />
              </div>
              {!editingId && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Password</label>
                  <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400" minLength={8} required />
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-emerald-700">{saving ? "Saving..." : editingId ? "Update User" : "Create User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}