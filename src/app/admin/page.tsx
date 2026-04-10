"use client";
// ============================================
// Admin Dashboard — Stats & Overview
// ============================================
import { useState, useEffect } from "react";
import { Card, Badge, DataTable } from "@/components/ui";
import { getUsers } from "@/lib/firestore";
import type { UserData } from "@/types";
import type { Column } from "@/components/ui/DataTable";

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers("all")
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const totalMembers = users.length;
  const activeMembers = users.filter((u) => u.isActive && u.membershipExpiry && u.membershipExpiry > now).length;
  const expiringThisWeek = users.filter(
    (u) => u.membershipExpiry && u.membershipExpiry > now && u.membershipExpiry <= weekFromNow
  );
  const recentSignups = [...users].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

  const stats = [
    { label: "Total Members", value: totalMembers, icon: "ri-group-line", color: "text-blue-500" },
    { label: "Active Members", value: activeMembers, icon: "ri-user-follow-line", color: "text-green-500" },
    { label: "Expiring This Week", value: expiringThisWeek.length, icon: "ri-alarm-warning-line", color: "text-amber-500" },
    { label: "No Active Plan", value: users.filter((u) => !u.membershipPlan).length, icon: "ri-user-unfollow-line", color: "text-red-500" },
  ];

  const expiringColumns: Column<UserData>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "membershipPlan", header: "Plan", render: (v) => (v ? String(v) : "--") },
    {
      key: "membershipExpiry",
      header: "Expiry",
      render: (v) => (v ? new Date(v as Date).toLocaleDateString("en-IN") : "--"),
    },
    {
      key: "membershipExpiry",
      header: "Days Left",
      render: (v) => {
        if (!v) return "--";
        const days = Math.ceil((new Date(v as Date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return <Badge variant={days <= 3 ? "danger" : "warning"} size="sm">{days}d</Badge>;
      },
    },
  ];

  const signupColumns: Column<UserData>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "createdAt",
      header: "Joined",
      render: (v) => new Date(v as Date).toLocaleDateString("en-IN"),
    },
    { key: "membershipPlan", header: "Plan", render: (v) => (v ? String(v) : "--") },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label} variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-surface-300 flex items-center justify-center">
                <i className={`${stat.icon} ${stat.color} text-lg`}></i>
              </div>
            </div>
            <p className="text-3xl font-black text-white">
              {loading ? "—" : stat.value}
            </p>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Expiring Soon */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
          Expiring This Week
        </h2>
        <DataTable
          columns={expiringColumns}
          data={expiringThisWeek}
          loading={loading}
          emptyMessage="No memberships expiring this week"
        />
      </div>

      {/* Recent Signups */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
          Recent Signups
        </h2>
        <DataTable
          columns={signupColumns}
          data={recentSignups}
          loading={loading}
          emptyMessage="No recent signups"
        />
      </div>
    </div>
  );
}
