"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, User } from "lucide-react";

type Mode = "login" | "signup";
type Role = "admin" | "student";

export default function HomePage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("admin");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/student");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-[#082a57] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Lost & Found</h1>
              <p className="mt-1 text-sm text-slate-300">
                Campus Recovery System
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Welcome
            </p>
            <h2 className="text-5xl font-bold leading-tight">
              Manage and recover lost items with ease.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              A centralized platform where students can browse found items and
              administrators can review claims, approve requests, and manage
              records.
            </p>
          </div>

          <p className="text-sm text-slate-400">© 2025 Lost & Found System</p>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900">
                  {mode === "login" ? "Login" : "Sign Up"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Choose your role and continue.
                </p>
              </div>

              <div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    role === "admin"
                      ? "bg-[#082a57] text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Admin
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange("student")}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    role === "student"
                      ? "bg-[#082a57] text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Student
                </button>
              </div>

              <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    mode === "login"
                      ? "bg-white text-[#082a57] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange("signup")}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    mode === "signup"
                      ? "bg-white text-[#082a57] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                      <User className="h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="w-full bg-transparent text-sm text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={`Enter your ${role} email`}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  {mode === "login"
                    ? `Login as ${role === "admin" ? "Admin" : "Student"}`
                    : `Sign Up as ${role === "admin" ? "Admin" : "Student"}`}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
