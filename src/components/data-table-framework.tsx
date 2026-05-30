import React, { ReactNode, useMemo, useState } from "react";

type SortDirection = "asc" | "desc" | null;

type Column<T> = {
  id: string;
  header: string;
  accessor: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  width?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey: (row: T, index: number) => string;
};

function compareValues(a: string | number, b: string | number, direction: Exclude<SortDirection, null>) {
  if (a === b) return 0;
  if (a < b) return direction === "asc" ? -1 : 1;
  return direction === "asc" ? 1 : -1;
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: 28,
        textAlign: "center",
        display: "grid",
        gap: 10,
        color: "#475569",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      <div style={{ lineHeight: "24px", fontSize: 14 }}>{description}</div>
    </div>
  );
}

export function DataTable<T>({
  columns,
  data,
  emptyTitle = "No rows found",
  emptyDescription = "There is nothing to display for the current table state.",
  rowKey,
}: DataTableProps<T>) {
  const [sortColumnId, setSortColumnId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedData = useMemo(() => {
    if (!sortColumnId || !sortDirection) return data;
    const targetColumn = columns.find((column) => column.id === sortColumnId);
    if (!targetColumn?.sortValue) return data;

    return [...data].sort((left, right) =>
      compareValues(targetColumn.sortValue!(left), targetColumn.sortValue!(right), sortDirection)
    );
  }, [columns, data, sortColumnId, sortDirection]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortValue) return;
    if (sortColumnId !== column.id) {
      setSortColumnId(column.id);
      setSortDirection("asc");
      return;
    }
    if (sortDirection === "asc") {
      setSortDirection("desc");
      return;
    }
    if (sortDirection === "desc") {
      setSortColumnId(null);
      setSortDirection(null);
      return;
    }
    setSortDirection("asc");
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {columns.map((column) => {
                const active = sortColumnId === column.id;
                const indicator = active ? (sortDirection === "asc" ? "▲" : sortDirection === "desc" ? "▼" : "↕") : "↕";
                return (
                  <th
                    key={column.id}
                    style={{
                      textAlign: "left",
                      padding: "14px 16px",
                      borderBottom: "1px solid #e2e8f0",
                      width: column.width,
                      background: "#f8fafc",
                      fontSize: 13,
                      color: "#334155",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        font: "inherit",
                        color: "inherit",
                        cursor: column.sortValue ? "pointer" : "default",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>{column.header}</span>
                      <span style={{ fontSize: 11, color: active ? "#0f172a" : "#94a3b8" }}>{indicator}</span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr key={rowKey(row, index)} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      style={{
                        padding: "14px 16px",
                        fontSize: 14,
                        color: "#0f172a",
                        verticalAlign: "top",
                      }}
                    >
                      {column.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type PersonRow = {
  id: string;
  name: string;
  role: string;
  team: string;
  score: number;
  status: string;
};

const demoColumns: Column<PersonRow>[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => <strong>{row.name}</strong>,
    sortValue: (row) => row.name,
    width: "24%",
  },
  {
    id: "role",
    header: "Role",
    accessor: (row) => row.role,
    sortValue: (row) => row.role,
    width: "22%",
  },
  {
    id: "team",
    header: "Team",
    accessor: (row) => row.team,
    sortValue: (row) => row.team,
    width: "18%",
  },
  {
    id: "score",
    header: "Score",
    accessor: (row) => row.score,
    sortValue: (row) => row.score,
    width: "16%",
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    sortValue: (row) => row.status,
    width: "20%",
  },
];

const demoData: PersonRow[] = [
  { id: "1", name: "Asha Verma", role: "Designer", team: "Platform", score: 91, status: "Active" },
  { id: "2", name: "Rohit Kumar", role: "Engineer", team: "Core", score: 87, status: "Active" },
  { id: "3", name: "Mina Patel", role: "Researcher", team: "Insights", score: 78, status: "Review" },
  { id: "4", name: "Dev Singh", role: "Engineer", team: "Platform", score: 82, status: "Paused" },
  { id: "5", name: "Sara Khan", role: "Manager", team: "Operations", score: 93, status: "Active" },
];

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 4, padding: 12, borderRadius: 16, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{value}</div>
    </div>
  );
}

export default function DataTableShowcase() {
  const [rows, setRows] = useState<PersonRow[]>(demoData);

  return (
    <main style={{ minHeight: "100%", padding: 24, background: "#f8fafc", display: "grid", gap: 20 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Data Table Framework</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: "24px" }}>
          A sortable table core with empty state handling and flexible row rendering.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <StatChip label="Rows" value={String(rows.length)} />
        <StatChip label="Sorted columns" value="5 available" />
        <StatChip label="Empty state" value="Built in" />
      </div>

      <section style={{ display: "grid", gap: 14 }}>
        <DataTable
          columns={demoColumns}
          data={rows}
          rowKey={(row) => row.id}
          emptyTitle="No team members"
          emptyDescription="Try another filter or reset the current view."
        />
      </section>

      <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: 18, background: "#fff", display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Reusable design features</h3>
        <div style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>Column metadata stays declarative, which makes table composition easy to extend.</div>
          <div>Sorting is optional and only activates on columns that provide sort values.</div>
          <div>The empty state is rendered through a dedicated component for clarity.</div>
          <div>Horizontal overflow is supported so dense tables remain usable on narrow screens.</div>
          <div>Row rendering is controlled through accessors instead of hardcoded cells.</div>
          <div>The API works for admin tools, analytics dashboards, and data review views.</div>
          <div>All demo content can be replaced with fetched data without changing the table core.</div>
        </div>
      </section>
    </main>
  );
}
