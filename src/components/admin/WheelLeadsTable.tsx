"use client";

import { useMemo, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination, PAGE_SIZE } from "@/components/ui/Pagination";
import { downloadCsv } from "@/lib/csv";
import { useStore } from "@/store/useStore";

export function WheelLeadsTable() {
  const wheelLeads = useStore((s) => s.wheelLeads);
  const deleteWheelLead = useStore((s) => s.deleteWheelLead);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return wheelLeads;
    return wheelLeads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
    );
  }, [wheelLeads, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    downloadCsv(
      "leads-ruleta.csv",
      ["Nombre", "Email", "Telefono", "Nacimiento", "Premio", "Codigo", "Consentimiento", "Fecha"],
      filtered.map((l) => [
        l.name,
        l.email,
        l.phone,
        l.birthdate ?? "",
        l.prizeLabel,
        l.prizeCode,
        l.consentMarketing ? "Sí" : "No",
        new Date(l.createdAt).toLocaleDateString("es-BO"),
      ])
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nombre o email..."
          className="w-full max-w-xs rounded-xl border border-forest/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf"
        />
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download size={16} />
          Exportar CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-soft text-xs uppercase tracking-wide text-forest/70">
            <tr>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Teléfono</th>
              <th className="px-4 py-3 font-semibold">Premio</th>
              <th className="px-4 py-3 font-semibold">Código</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((lead) => (
              <tr key={lead.id} className="border-t border-soft hover:bg-surface/80">
                <td className="px-4 py-3 font-medium text-forest">{lead.name}</td>
                <td className="px-4 py-3 text-ink/70">{lead.email}</td>
                <td className="px-4 py-3 text-ink/70">{lead.phone}</td>
                <td className="px-4 py-3 text-ink/70">{lead.prizeLabel}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink/60">
                  {lead.prizeCode}
                </td>
                <td className="px-4 py-3 text-ink/50">
                  {new Date(lead.createdAt).toLocaleDateString("es-BO")}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={async () => {
                      if (confirm(`¿Eliminar el lead de "${lead.name}"?`)) {
                        const result = await deleteWheelLead(lead.id);
                        if (!result.ok) {
                          alert(result.message ?? "No se pudo eliminar el lead.");
                        }
                      }
                    }}
                    className="rounded-lg p-2 text-red-600"
                    aria-label="Eliminar lead"
                  >
                    <Trash2 size={16} className="pop-glow hover:text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink/50">
                  {wheelLeads.length === 0
                    ? "Aún no hay participantes."
                    : "No hay leads que coincidan."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
