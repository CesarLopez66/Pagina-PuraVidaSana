import { buildZip } from "@/lib/zip";

// Genera un .xlsx real (mínimo, sin librerías de terceros) para que la
// plantilla de importación tenga columnas ajustadas al contenido y colores
// de marca — algo que un CSV plano no puede llevar. Solo ESCRIBE archivos
// con contenido que nosotros controlamos (nunca lee archivos ajenos), así
// que no hereda el riesgo de seguridad de las librerías xlsx/exceljs, cuyas
// vulnerabilidades conocidas están en el lado de lectura de archivos no
// confiables.

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colLetter(index: number): string {
  let n = index + 1;
  let letters = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

type CellValue = string | number | boolean;

export interface XlsxSheetOptions {
  sheetName: string;
  headers: string[];
  rows: CellValue[][];
  /** Estilo de celda por fila de datos (índice en `rows`), por defecto 0 (normal). */
  rowStyle?: (rowIndex: number) => number;
  maxColWidth?: number;
}

const HEADER_FILL = "184D28"; // brand forest
const EXAMPLE_FILL = "EAF5E4"; // light brand leaf tint

export function buildProductsTemplateXlsx({
  sheetName,
  headers,
  rows,
  rowStyle,
  maxColWidth = 50,
}: XlsxSheetOptions): Buffer {
  const colCount = headers.length;
  const widths = headers.map((h, i) => {
    const headerLen = h.length;
    const maxCellLen = rows.reduce((max, row) => {
      const cell = row[i];
      const len = cell === undefined || cell === null ? 0 : String(cell).length;
      return Math.max(max, len);
    }, 0);
    return Math.min(Math.max(headerLen, maxCellLen) + 3, maxColWidth);
  });

  const colsXml = `<cols>${widths
    .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
    .join("")}</cols>`;

  const headerRowXml = `<row r="1" s="1">${headers
    .map(
      (h, i) =>
        `<c r="${colLetter(i)}1" s="1" t="inlineStr"><is><t>${escapeXml(h)}</t></is></c>`
    )
    .join("")}</row>`;

  const dataRowsXml = rows
    .map((row, rIdx) => {
      const style = rowStyle ? rowStyle(rIdx) : 0;
      const cells = row
        .map((cell, cIdx) => {
          const ref = `${colLetter(cIdx)}${rIdx + 2}`;
          if (typeof cell === "number") {
            return `<c r="${ref}" s="${style}" t="n"><v>${cell}</v></c>`;
          }
          const text = typeof cell === "boolean" ? (cell ? "TRUE" : "FALSE") : cell;
          return `<c r="${ref}" s="${style}" t="inlineStr"><is><t>${escapeXml(text)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rIdx + 2}" s="${style}">${cells}</row>`;
    })
    .join("");

  const lastCol = colLetter(colCount - 1);
  const lastRow = rows.length + 1;

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:${lastCol}${lastRow}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  ${colsXml}
  <sheetData>${headerRowXml}${dataRowsXml}</sheetData>
</worksheet>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  // cellXfs: 0 = normal, 1 = encabezado (fondo forest, texto blanco negrita),
  // 2 = fila de ejemplo (fondo verde claro, cursiva).
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><sz val="11"/><name val="Calibri"/><b/><color rgb="FFFFFFFF"/></font>
    <font><sz val="11"/><name val="Calibri"/><i/><color rgb="FF184D28"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF${HEADER_FILL}"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF${EXAMPLE_FILL}"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1">
      <alignment vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
  </cellXfs>
</styleSheet>`;

  const zip = buildZip([
    { name: "[Content_Types].xml", data: Buffer.from(contentTypes, "utf8") },
    { name: "_rels/.rels", data: Buffer.from(rootRels, "utf8") },
    { name: "xl/workbook.xml", data: Buffer.from(workbookXml, "utf8") },
    { name: "xl/_rels/workbook.xml.rels", data: Buffer.from(workbookRels, "utf8") },
    { name: "xl/styles.xml", data: Buffer.from(stylesXml, "utf8") },
    { name: "xl/worksheets/sheet1.xml", data: Buffer.from(sheetXml, "utf8") },
  ]);

  return zip;
}
