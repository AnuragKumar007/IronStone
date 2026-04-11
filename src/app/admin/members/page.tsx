"use client";
// ============================================
// Admin Members — User management
// ============================================
import { useState, useEffect } from "react";
import { Button, Badge, Input, Modal, DataTable } from "@/components/ui";
import { getUsers, updateUserMembership } from "@/lib/firestore";
import type { UserData } from "@/types";
import type { Column } from "@/components/ui/DataTable";

type Filter = "all" | "active" | "expired" | "noPlan";

export default function AdminMembersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState<UserData | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    getUsers(filter)
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const filtered = search
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const handleRevoke = async (uid: string) => {
    setRevoking(uid);
    try {
      await updateUserMembership(uid, {
        isActive: false,
        membershipPlan: null,
        membershipExpiry: null,
      } as Partial<UserData>);
      fetchUsers();
    } catch (err) {
      console.error("Revoke failed:", err);
    } finally {
      setRevoking(null);
    }
  };

  const now = new Date();

  const getStatus = (u: UserData) => {
    if (!u.membershipPlan) return { label: "No Plan", variant: "neutral" as const };
    if (u.isActive && u.membershipExpiry && u.membershipExpiry > now) return { label: "Active", variant: "success" as const };
    return { label: "Expired", variant: "danger" as const };
  };

  const columns: Column<UserData>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone", render: (v) => (v as string) || "—" },
    { key: "membershipPlan", header: "Plan", render: (v, row) => {
      if (!v) return "—";
      const type = row.membershipType === "trainer" ? " + Trainer" : "";
      return String(v) + type;
    }},
    {
      key: "membershipExpiry",
      header: "Expiry",
      render: (v) => (v ? new Date(v as Date).toLocaleDateString("en-IN") : "—"),
    },
    {
      key: "isActive",
      header: "Status",
      render: (_, row) => {
        const s = getStatus(row);
        return <Badge variant={s.variant} size="sm">{s.label}</Badge>;
      },
    },
    {
      key: "uid",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewUser(row)}
            className="text-gray-500 hover:text-white transition-colors"
            title="View"
          >
            <i className="ri-eye-line"></i>
          </button>
          {row.membershipPlan && (
            <button
              onClick={() => handleRevoke(row.uid)}
              disabled={revoking === row.uid}
              className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Revoke membership"
            >
              <i className={revoking === row.uid ? "ri-loader-4-line animate-spin" : "ri-close-circle-line"}></i>
            </button>
          )}
        </div>
      ),
    },
  ];

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
    { label: "No Plan", value: "noPlan" },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Members</h1>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <Input
            icon="ri-search-line"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No members found"
      />

      {/* View User Modal */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="Member Details" size="md">
        {viewUser && (
          <div className="space-y-4">
            {[
              { label: "Name", value: viewUser.name },
              { label: "Email", value: viewUser.email },
              { label: "Phone", value: viewUser.phone || "—" },
              { label: "Role", value: viewUser.role },
              { label: "Plan", value: viewUser.membershipPlan || "None" },
              { label: "Plan Type", value: viewUser.membershipType === "trainer" ? "Gym + Trainer" : viewUser.membershipPlan ? "Gym Only" : "—" },
              { label: "Active", value: viewUser.isActive ? "Yes" : "No" },
              { label: "Start", value: viewUser.membershipStart ? new Date(viewUser.membershipStart).toLocaleDateString("en-IN") : "—" },
              { label: "Expiry", value: viewUser.membershipExpiry ? new Date(viewUser.membershipExpiry).toLocaleDateString("en-IN") : "—" },
              { label: "Joined", value: new Date(viewUser.createdAt).toLocaleDateString("en-IN") },
            ].map((item) => (
              <div key={item.label} className="flex justify-between border-b border-zinc-800/50 pb-2">
                <span className="text-gray-500 text-sm">{item.label}</span>
                <span className="text-white text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
