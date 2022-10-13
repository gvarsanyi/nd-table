import { TableRenderData } from './table-render-data.class.js';

export function tableRenderCellsVAlign(render: TableRenderData): void {
  for (let x = render.startX; x < render.columns; x++) {
    for (let y = render.startY; y < render.rows; y++) {
      const { lines, options } = render.data[x][y];
      let count = 0;
      const valign = options.valign;
      const len = render.rowHeight[y];
      while (lines.length < len) {
        if (valign === 'bottom') {
          lines.unshift('');
        } else if (valign === 'middle') {
          if (count % 2) {
            lines.push('');
          } else {
            lines.unshift('');
          }
          count++;
        } else {
          lines.push('');
        }
      }
    }
  }
}
