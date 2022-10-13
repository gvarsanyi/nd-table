import { TableRenderData } from '../table-render/table-render-data.class.js';

const dblQuoteRx = /\"/g;
const nonSimpleRx = /[^a-z_0-9]/i;

export function formatCSV(render: TableRenderData, tsv?: boolean): string {
  let out = '';
  const separator = tsv ? '\t' : ',';
  for (let y = render.startY; y < render.rows; y++) {
    for (let x = render.startX; x < render.columns; x++) {
      const rendered = render.data[x][y].rendered;
      const content = rendered.match(nonSimpleRx) ? `"${rendered.replace(dblQuoteRx, '""')}"` : rendered;
      out += (x > render.startX ? separator : '') + content;
    }
    out += '\n';
  }
  return out;
}
