"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useAuth() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("Please login to continue");
      router.push("/user/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((error) => {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("access_token");
        router.push("/user/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return { user, loading };
}
