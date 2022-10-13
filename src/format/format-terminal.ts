import { OPT_COLORS } from '../cell/cell-render-options.js';
import { TableRenderData } from '../table-render/table-render-data.class.js';

const separatorTypes = {
  ascii: ' -|+--++|+|+++++',
  rounded: ' ╴╷╮╶─╭┬╵╯│┤╰┴├┼',
  utf8: ' ╴╷┐╶─┌┬╵┘│┤└┴├┼'
} as const;

const ANSI_RESET = '\u001b[0m';

const ansiColors: { [color in (typeof OPT_COLORS)[number]]: string } = {
  black: '\u001b[30m',
  blue: '\u001b[34m',
  cyan: '\u001b[36m',
  default: '',
  green: '\u001b[32m',
  magenta: '\u001b[35m',
  red: '\u001b[31m',
  white: '\u001b[37m',
  yellow: '\u001b[33m'
};

export type TerminalFormat = 'ascii' | 'utf8' | 'rounded';

export function formatTerminal(render: TableRenderData, format: TerminalFormat, allowANSIStyles?: boolean): string {
  const separators = separatorTypes[format];
  let out = '';
  for (let y = render.startY; y < render.rows; y++) {
    const len = render.data[render.startX]?.[y].grid.length || 0;
    for (let i = 0; i < len; i++) {
      for (let x = render.startX; x < render.columns; x++) {
        const cell = render.data[x][y];
        const { bold, color } = cell.options;
        for (const part of cell.grid[i]) {
          if (Array.isArray(part)) {
            out += (allowANSIStyles ? '\u001b[38;5;240m' : '') + separators[part[0]].repeat(part[1]) + (allowANSIStyles ? ANSI_RESET : '');
          } else if (allowANSIStyles && part.trim()) {
            const colorCode = color && color !== 'default' && ansiColors[color] || '';
            out += `${bold ? '\u001b[1m' : ''}${colorCode}${part}${bold || colorCode ? ANSI_RESET : ''}`;
          } else {
            out += part;
          }
        }
      }
    }
  }
  return out;
}
