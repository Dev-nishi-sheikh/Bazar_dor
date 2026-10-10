
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSignin(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Signin error:", error);
      toast.error("সাইন ইন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider) {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Social login failed");
      }
    } catch (error) {
      console.error("Social login error:", error);
      toast.error("Social login করতে সমস্যা হয়েছে");
    } finally {
      setSocialLoading("");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold">
            🛒 বাজার দর
          </Link>

          <h1 className="mt-6 text-3xl font-bold">
            সাইন ইন করুন
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টে লগইন করুন।
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={socialLoading !== "" || loading}
            className="w-full rounded-xl border px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {socialLoading === "google"
              ? "Google দিয়ে লগইন হচ্ছে..."
              : "Google দিয়ে লগইন"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            disabled={socialLoading !== "" || loading}
            className="w-full rounded-xl border px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {socialLoading === "github"
              ? "GitHub দিয়ে লগইন হচ্ছে..."
              : "GitHub দিয়ে লগইন"}
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSignin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading || socialLoading !== ""}
            className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-medium text-black underline">
            সাইন আপ করুন
          </Link>
        </p>

        <Link href="/" className="mt-5 block text-center text-sm text-gray-500 hover:text-black">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
