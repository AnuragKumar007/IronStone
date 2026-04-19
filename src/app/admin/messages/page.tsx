"use client";
// ============================================
// Admin Messages — View & manage contact form submissions
// ============================================
import { useState, useEffect } from "react";
import { Badge, Modal, DataTable } from "@/components/ui";
import { getContactMessages, updateContactMessage, deleteContactMessage } from "@/lib/firestore";
import type { ContactMessage } from "@/types";
import type { Column } from "@/components/ui/DataTable";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMessages = () => {
    setLoading(true);
    getContactMessages()
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read && msg.id) {
      await updateContactMessage(msg.id, { read: true });
      fetchMessages();
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    if (!msg.id) return;
    await updateContactMessage(msg.id, { read: !msg.read });
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...msg, read: !msg.read });
    }
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteContactMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      console.error("Delete message failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: "name",
      header: "Name",
      render: (v, row) => (
        <span className={`font-semibold ${row.read ? "text-gray-400" : "text-white"}`}>
          {!row.read && <i className="ri-circle-fill text-[8px] text-red-500 mr-2 align-middle"></i>}
          {String(v)}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (v) => <span className="text-gray-400">{String(v)}</span>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (v) => {
        const d = new Date(v as Date);
        return (
          <span className="text-gray-400 text-xs">
            {d.toLocaleDateString("en-IN")} &middot; {d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        );
      },
    },
    {
      key: "read",
      header: "Status",
      render: (_, row) =>
        row.read ? (
          <Badge variant="neutral" size="sm">Read</Badge>
        ) : (
          <Badge variant="info" size="sm">New</Badge>
        ),
    },
    {
      key: "id",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleRead(row); }}
            className="text-gray-500 hover:text-white transition-colors"
            title={row.read ? "Mark as unread" : "Mark as read"}
          >
            <i className={row.read ? "ri-mail-unread-line" : "ri-mail-check-line"}></i>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id!); }}
            disabled={deleting === row.id}
            className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <i className={deleting === row.id ? "ri-loader-4-line animate-spin" : "ri-delete-bin-line"}></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Messages</h1>
        {messages.filter((m) => !m.read).length > 0 && (
          <span className="text-sm text-gray-400">
            <span className="text-red-500 font-bold">{messages.filter((m) => !m.read).length}</span> unread
          </span>
        )}
      </div>

      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        emptyMessage="No messages yet. Messages from the contact form will appear here."
        onRowClick={handleOpenMessage}
      />

      {/* Message Detail Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
        size="md"
      >
        {selectedMessage && (
          <div className="space-y-5">
            {/* Sender Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Name</p>
                <p className="text-white text-sm">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Email</p>
                <p className="text-white text-sm">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Phone</p>
                <p className="text-white text-sm">{selectedMessage.phone || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Date</p>
                <p className="text-white text-sm">
                  {new Date(selectedMessage.createdAt).toLocaleDateString("en-IN")} &middot;{" "}
                  {new Date(selectedMessage.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Message Body */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Message</p>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleRead(selectedMessage)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                           bg-zinc-800 text-gray-400 hover:text-white transition-all"
              >
                <i className={selectedMessage.read ? "ri-mail-unread-line" : "ri-mail-check-line"}></i>
                {selectedMessage.read ? "Mark as Unread" : "Mark as Read"}
              </button>
              <button
                onClick={() => { handleDelete(selectedMessage.id!); }}
                disabled={deleting === selectedMessage.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                           bg-red-600/10 text-red-500 hover:bg-red-600/20 transition-all disabled:opacity-50"
              >
                <i className={deleting === selectedMessage.id ? "ri-loader-4-line animate-spin" : "ri-delete-bin-line"}></i>
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
