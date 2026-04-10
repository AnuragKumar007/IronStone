// ============================================
// DataTable — Basic data table for admin pages
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Column<T = any> {
  key: string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found",
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full rounded-2xl bg-surface-100 border border-zinc-800/50 p-8">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <i className="ri-loader-4-line animate-spin text-lg" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-surface-100 border border-zinc-800/50 p-8 text-center text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-2xl bg-surface-100 border border-zinc-800/50 overflow-x-auto ${className}`}
    >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-gray-400 text-xs font-semibold uppercase tracking-widest px-6 py-4"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-zinc-800/50 last:border-0 ${
                onRowClick ? "cursor-pointer hover:bg-surface-200" : ""
              } ${i % 2 === 0 ? "bg-surface-100" : "bg-surface-200/50"}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="text-gray-300 text-sm px-6 py-4">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
