import { TableRenderData } from './table-render-data.class.js';

// [sep, sep,   sep,   sep, sep, ent]
// [sep, sep, lines[], sep, sep, ent]
// [sep, sep,   sep,   sep, sep, ent]
export function tableRenderCellGrids(render: TableRenderData): void {
  const { horizontal, horizontalSerparation, vertical, verticalSerparation } = render.borders;
  for (let x = render.startX; x < render.columns; x++) {
    const hasLeftPadding = verticalSerparation[x] || x > render.startX;
    const hasRightPadding = verticalSerparation[x + 1];
    const lineEnd = (x === render.columns - 1 ? '\n' : '');
    for (let y = render.startY; y < render.rows; y++) {
      const cell = render.data[x][y];
      const hasTopBorder = horizontal[x][y];
      const hasBottomBorder = horizontal[x][y + 1];
      const hasLeftBorder = vertical[x][y];
      const hasRightBorder = vertical[x + 1]?.[y];
      if (horizontalSerparation[y]) {
        cell.grid.push([
          (verticalSerparation[x] ? [render.borders.crossingID(x, y), 1] : ''),
          (hasLeftPadding ? [(hasTopBorder ? 5 : 0), 1] : ''),
          [(hasTopBorder ? 5 : 0), render.columnWidth[x]],
          (hasRightPadding ? [(hasTopBorder ? 5 : 0), 1] : ''),
          (lineEnd && verticalSerparation[x + 1] ? [render.borders.crossingID(x + 1, y), 1] : ''),
          lineEnd
        ]);
      }
      const len = cell.lines.length;
      for (let i = 0; i < len; i++) {
        cell.grid.push([
          (verticalSerparation[x] ? [(hasLeftBorder ? 10 : 0), 1] : ''),
          (hasLeftPadding ? [0, 1] : ''),
          cell.lines[i],
          (hasRightPadding ? [0, 1] : ''),
          (lineEnd && verticalSerparation[x + 1] ? [(hasRightBorder ? 10 : 0), 1] : ''),
          lineEnd
        ]);
      }
      if (y === render.rows - 1 && horizontalSerparation[y + 1]) {
        cell.grid.push([
          (verticalSerparation[x] ? [render.borders.crossingID(x, y + 1), 1] : ''),
          (hasLeftPadding ? [(hasBottomBorder ? 5 : 0), 1] : ''),
          [(hasBottomBorder ? 5 : 0), render.columnWidth[x]],
          (hasRightPadding ? [(hasBottomBorder ? 5 : 0), 1] : ''),
          (lineEnd && verticalSerparation[x + 1] ? [render.borders.crossingID(x + 1, y + 1), 1] : ''),
          lineEnd
        ]);
      }
    }
  }
}
