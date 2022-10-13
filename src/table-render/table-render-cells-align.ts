import { TableRenderData } from './table-render-data.class.js';

export function tableRenderCellsAlign(render: TableRenderData): void {
  for (let x = render.startX; x < render.columns; x++) {
    for (let y = render.startY; y < render.rows; y++) {
      const { lines, options } = render.data[x][y];
      let count = 0;
      const align = options.align;
      const len = render.rowHeight[y];
      for (let i = 0; i < len; i++) {
        while (lines[i].length < render.columnWidth[x]) {
          if (align === 'right') {
            lines[i] = ' ' + lines[i];
          } else if (align === 'center') {
            if (count % 2) {
              lines[i] = ' ' + lines[i];
            } else {
              lines[i] += ' ';
            }
            count++;
          } else {
            lines[i] += ' ';
          }
        }
      }
    }
  }
}
