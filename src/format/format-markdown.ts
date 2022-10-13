import { TableRenderData } from '../table-render/table-render-data.class.js';

const pipeRx = /\|/g;
const spacedContentRx = /^(\s*)(.*[^\s])(\s*)$/;

export function formatMarkdown(render: TableRenderData): string {
  let out = '';
  if (render.startY === 0) {
    for (let x = render.startX; x < render.columns; x++) {
      out += '|' + ' '.repeat(render.columnWidth[x] + 2);
    }
    out += '|\n';
  }
  for (let y = render.startY; y < render.rows; y++) {
    if (y === 0) {
      for (let x = render.startX; x < render.columns; x++) {
        const rightCount = render.data[x].filter((cell) => cell.options.align === 'right').length;
        const centerCount = render.data[x].filter((cell) => cell.options.align === 'center').length;
        const align = (rightCount > render.rows / 2 ? 'right' : centerCount > render.rows / 2 ? 'center' : undefined);
        out += '|' + (align === 'center' ? ':' : '-') + '-'.repeat(render.columnWidth[x]) + (align ? ':' : '-');
      }
      out += '|\n';
    }
    let targetLen = 0;
    let rowLen = 0;
    for (let x = render.startX; x < render.columns; x++) {
      const cell = render.data[x][y];
      let content = (cell.rendered.trim() ? cell.rendered.split('\n').join('<br>') : ' '.repeat(render.columnWidth[x]))
        .replace(pipeRx, '&#124;');
      const { bold, italic, link } = cell.options;
      if (!!content.trim()) {
        const pre = (italic ? '_' : '') + (bold ? '**' : '') + (link ? '[' : '');
        const post = (link ? `](${link})` : '') + (bold ? '**' : '') + (italic ? '_' : '');
        content = content.replace(spacedContentRx, `$1${pre}$2${post}$3`);
      }
      content = ' ' + content + (content.length < render.columnWidth[x] ? ' '.repeat(render.columnWidth[x] - content.length) : '') + ' ';
      targetLen += render.columnWidth[x] + 3;
      rowLen += 1 + content.length;
      while (rowLen > targetLen && !content[content.length - 1].trim()) {
        content = content.substring(0, content.length - 1);
        rowLen--;
      }
      while (rowLen > targetLen && !content[0].trim()) {
        content = content.substring(1);
        rowLen--;
      }
      out += '|' + content;
    }
    out += '|\n';
  }
  return out;
}
