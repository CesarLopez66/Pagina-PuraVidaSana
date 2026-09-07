"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { detectDelimiter, parseCsv } from "@/lib/csv";
import { useStore } from "@/store/useStore";

interface BulkImportModalProps {
  open: boolean;
  onClose: () => void;
}

const HEADER_ALIASES: Record<string, string> = {
  nombre: "name",
  categoria: "category",
  precio: "price",
  stock: "stock",
  descripcion: "description",
  imagen: "image",
  imagen_url: "image",
  "imagen principal": "image",
  destacado: "featured",
  imagenes_adicionales: "images",
  imagenes: "images",
  beneficios: "benefits",
  etiquetas: "tags",
  tags: "tags",
};

const TRUTHY = ["true", "1", "si", "sí", "x", "verdadero", "yes"];

function normalizeHeader(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function parseProductsCsv(text: string) {
  const rows = parseCsv(text, detectDelimiter(text));
  if (rows.length < 2) {
    return { headerError: "El archivo no tiene filas de datos.", items: [] as Record<string, unknown>[] };
  }

  const keys = rows[0].map((h) => HEADER_ALIASES[normalizeHeader(h)] ?? null);
  const required = ["name", "category", "price", "stock"];
  const missing = required.filter((r) => !keys.includes(r));
  if (missing.length > 0) {
    return {
      headerError: `Faltan columnas obligatorias: ${missing.join(", ")}.`,
      items: [] as Record<string, unknown>[],
    };
  }

  const items = rows.slice(1).map((cells) => {
    const obj: Record<string, unknown> = {};
    keys.forEach((key, i) => {
      if (!key) return;
      const raw = (cells[i] ?? "").trim();
      if (key === "price" || key === "stock") {
        obj[key] = raw === "" ? NaN : Number(raw.replace(",", "."));
      } else if (key === "featured") {
        obj[key] = TRUTHY.includes(raw.toLowerCase());
      } else if (key === "images" || key === "benefits" || key === "tags") {
        obj[key] = raw
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        obj[key] = raw;
      }
    });
    return obj;
  });

  return { headerError: null as string | null, items };
}

export function BulkImportModal({ open, onClose }: BulkImportModalProps) {
  const fetchProducts = useStore((s) => s.fetchProducts);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [pendingItems, setPendingItems] = useState<Record<string, unknown>[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created: number; rejected: string[] } | null>(null);

  const reset = () => {
    setFileName(null);
    setRowCount(null);
    setParseError(null);
    setPendingItems(null);
    setResult(null);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    reset();
    setFileName(file.name);

    // Los .xlsx binarios son archivos ZIP (firma "PK"); si detectamos eso,
    // avisamos en vez de intentar leerlo como texto y fallar en silencio.
    const head = new Uint8Array(await file.slice(0, 2).arrayBuffer());
    if (head[0] === 0x50 && head[1] === 0x4b) {
      setParseError(
        "Este archivo es un .xlsx binario. Guárdalo como CSV (en Excel: Archivo → Guardar como → CSV UTF-8) y vuelve a subirlo."
      );
      return;
    }

    const text = await file.text();
    const { headerError, items } = parseProductsCsv(text);
    if (headerError) {
      setParseError(headerError);
      return;
    }
    if (items.length === 0) {
      setParseError("No se encontraron filas con datos.");
      return;
    }
    setRowCount(items.length);
    setPendingItems(items);
  };

  const runImport = async () => {
    if (!pendingItems) return;
    setImporting(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: pendingItems }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setParseError(data.message ?? "No se pudo importar el archivo.");
        setPendingItems(null);
        return;
      }
      setResult({ created: data.created?.length ?? 0, rejected: data.rejected ?? [] });
      setPendingItems(null);
      await fetchProducts();
    } catch {
      setParseError("No se pudo importar el archivo. Revisa tu conexión.");
      setPendingItems(null);
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importar productos desde Excel/CSV"
      size="md"
      variant="solid"
    >
      <div className="space-y-4">
        <p className="text-sm text-ink/65">
          Usa la plantilla (&ldquo;Descargar plantilla&rdquo;) para llenar tus productos
          en Excel, guárdala como <strong>CSV</strong> (Archivo → Guardar
          como → CSV UTF-8) y súbela aquí. Varios valores en una misma
          celda (imágenes, beneficios, etiquetas) van separados por{" "}
          <strong>|</strong>.
        </p>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-forest/20 bg-surface px-4 py-8 text-center transition hover:border-leaf">
          <UploadCloud size={28} className="text-leaf" />
          <span className="text-sm font-medium text-forest">
            {fileName ?? "Haz clic para elegir un archivo .csv"}
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        {parseError && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {parseError}
          </p>
        )}

        {rowCount !== null && pendingItems && (
          <p className="rounded-xl bg-leaf/10 px-3 py-2 text-sm text-forest">
            Se encontraron <strong>{rowCount}</strong> fila
            {rowCount === 1 ? "" : "s"} listas para revisar. Al importar, cada
            fila se valida de nuevo en el servidor.
          </p>
        )}

        {result && (
          <div className="space-y-2 rounded-xl bg-leaf/10 px-3 py-2.5 text-sm text-forest">
            <p>
              <strong>{result.created}</strong> producto
              {result.created === 1 ? "" : "s"} creado
              {result.created === 1 ? "" : "s"} correctamente.
            </p>
            {result.rejected.length > 0 && (
              <div>
                <p className="font-semibold text-amber-700">
                  {result.rejected.length} fila
                  {result.rejected.length === 1 ? "" : "s"} con errores (no se
                  importaron):
                </p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-amber-700">
                  {result.rejected.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-soft pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            {result ? "Cerrar" : "Cancelar"}
          </Button>
          {pendingItems && !result && (
            <Button
              type="button"
              variant="secondary"
              onClick={runImport}
              disabled={importing}
            >
              {importing ? "Importando..." : `Importar ${rowCount} fila${rowCount === 1 ? "" : "s"}`}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
