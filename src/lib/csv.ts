// Parser/serializador CSV mínimo, sin dependencias externas. Evita librerías
// como "xlsx" (vulnerabilidad de prototype pollution sin parche) o
// "exceljs" (arrastra una dependencia con CVE moderado) para una necesidad
// tan simple como leer/escribir una tabla plana. Excel abre y guarda CSV
// de forma nativa, así que cumple el mismo propósito.

// Con Windows en español (configuración regional típica en Bolivia), Excel
// usa ";" como separador de columnas al abrir un CSV con doble clic (usa
// "," como separador decimal, así que reserva la coma para los números).
// Si generamos el archivo con comas, Excel mete todo en una sola columna.
export function detectDelimiter(text: string): "," | ";" {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const commas = (firstLine.match(/,/g) ?? []).length;
  const semicolons = (firstLine.match(/;/g) ?? []).length;
  return semicolons > commas ? ";" : ",";
}

export function parseCsv(text: string, delimiter: "," | ";" = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  // Normaliza saltos de línea y quita un posible BOM inicial (Excel lo
  // agrega al guardar CSV con codificación UTF-8).
  const src = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const char = src[i];

    if (inQuotes) {
      if (char === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function escapeCsvField(value: string, delimiter: "," | ";"): string {
  if (value.includes(delimiter) || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsv(
  rows: Array<Array<string | number | boolean>>,
  delimiter: "," | ";" = ";"
): string {
  return rows
    .map((row) => row.map((cell) => escapeCsvField(String(cell), delimiter)).join(delimiter))
    .join("\n");
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number | boolean>>
) {
  const content = toCsv([headers, ...rows]);
  // BOM UTF-8 al inicio: sin esto, Excel en Windows a veces interpreta
  // tildes/ñ con la codificación equivocada al abrir el archivo.
  const blob = new Blob(["﻿" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
