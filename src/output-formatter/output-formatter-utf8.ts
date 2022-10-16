import { CONFIG_COLORS } from '../config/config.class';
import { TableRenderData } from '../table-render-data.class';

const separatorTypes = {
  ascii: ' -|+--++|+|+++++',
  rounded: ' ╴╷╮╶─╭┬╵╯│┤╰┴├┼',
  utf8: ' ╴╷┐╶─┌┬╵┘│┤└┴├┼'
} as const;

const ANSI_RESET = '\u001b[0m';

const ansiColors: { [color in (typeof CONFIG_COLORS)[number]]: string } = {
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

type OutputFormatterFlavor = 'ascii' | 'utf8' | 'rounded';

export function outputFormatterUTF8(renderData: TableRenderData, options?: { ansi?: boolean; flavor?: OutputFormatterFlavor }): string {
  const allowANSIStyles = !!(options?.ansi);
  const flavor = options?.flavor || 'utf8';
  const separators = separatorTypes[flavor] || separatorTypes.utf8;
  const { borders, cellConfig, columns, rows, startX, startY } = renderData;
  let out = '';
  for (let y = startY; y < rows; y++) {
    const len = borders.grid[startX]?.[y].length || 0;
    for (let i = 0; i < len; i++) {
      for (let x = startX; x < columns; x++) {
        const { bold, color } = cellConfig[x][y];
        for (const part of borders.grid[x][y][i]) {
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
