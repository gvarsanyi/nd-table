import { TableRenderData } from './table-render-data.class.js';

const numberishRx = /^[0-9\.\-,%\s]*$/;

export function tableRenderColumnAlign(render: TableRenderData): void {
  if (!render.tableOptions.align) { // automatic column align where there is no override
    if (!render.rowHeaders && !render.rowOptions[-1].align) {
      for (let y = 0; y < render.rows; y++) {
        render.data[-1][y].options.align = render.data[-1][y].options.align || 'right';
      }
    }
    for (let x = 0; x < render.columns; x++) {
      if (!render.columnOptions[x].align) {
        let count = 0;
        for (let y = 0; y < render.rows; y++) {
          const lines = render.data[x][y].lines;
          const len = lines.length;
          for (let i = 0; i < len; i++) {
            if (lines[i].trim().match(numberishRx)) {
              count++;
            }
          }
        }
        if (count > render.rows / 2) {
          for (let y = 0; y < render.rows; y++) {
            render.data[x][y].options.align = render.data[x][y].options.align || 'right';
          }
        }
      }
    }
  }
}
