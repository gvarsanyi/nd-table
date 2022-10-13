import { TableRenderData } from './table-render-data.class.js';

export function tableRenderBorderSet(render: TableRenderData, x: number, y: number): void {
  const { cellOptions, columnOptions, rowOptions, tableOptions } = render;
  const { horizontal, horizontalSerparation, vertical, verticalSerparation } = render.borders;

  const h1 = cellOptions[x]?.[y]?.borderTop ??
      rowOptions[y]?.borderTop ??
      (y === render.startY ? tableOptions.borderTop : undefined) ??
      (y === render.rows ? tableOptions.borderBottom : undefined);
  const h2 = cellOptions[x]?.[y - 1]?.borderBottom ?? rowOptions[y - 1]?.borderBottom;
  horizontal[x][y] = h1 || h2 || false;
  horizontalSerparation[y] = horizontalSerparation[y] || horizontal[x][y];

  const v1 =
      cellOptions[x]?.[y]?.borderLeft ??
      columnOptions[x]?.borderLeft ??
      (x === render.startX ? tableOptions.borderLeft : undefined) ??
      (x === render.columns ? tableOptions.borderRight : undefined);
  const v2 = cellOptions[x - 1]?.[y]?.borderRight ?? columnOptions[x - 1]?.borderRight;
  vertical[x][y] = v1 || v2 || false;
  verticalSerparation[x] = verticalSerparation[x] || vertical[x][y];
}
