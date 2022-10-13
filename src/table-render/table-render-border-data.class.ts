import { TableRenderData } from './table-render-data.class.js';

/**
 * Border data
 */
export class TableRenderBorderData {
  /** Map of horizontal (top/bottom) borders on (x, y) coordinates (+ 1 closing row) */
  readonly horizontal: boolean[][] = [];

  /** Indication of at least 1 horizontal border for each y coordinate (+ 1 closing row) */
  readonly horizontalSerparation: boolean[] = [];

  /** Map of vertical (left/right) borders on (x, y) coordinates (+ 1 closing column) */
  readonly vertical: boolean[][] = [];

  /** Indication of at least 1 vertical border for each x coordinate (+ 1 closing column) */
  readonly verticalSerparation: boolean[] = [];

  /**
   * Instantiate border info object, set minimum data
   * @param render data source
   */
  constructor(render: TableRenderData) {
    for (let x = render.startX; x < render.columns; x++) {
      this.horizontal[x] = [];
    }
    this.horizontal[render.columns] = [];
    for (let y = render.startY; y < render.rows; y++) {
      this.vertical[y] = [];
    }
    this.vertical[render.rows] = [];
  }

  /**
   * TRBL as in top/right/bottom/left
   * 0000 ' ' 0
   * 0001 '╴' 1
   * 0010 '╷' 2
   * 0011 '┐' 3
   * 0100 '╶' 4
   * 0101 '─' 5
   * 0110 '┌' 6
   * 0111 '┬' 7
   * 1000 '╵' 8
   * 1001 '┘' 9
   * 1010 '│' 10
   * 1011 '┤' 11
   * 1100 '└' 12
   * 1101 '┴' 13
   * 1110 '├' 14
   * 1111 '┼' 15
   * @param x coordinate
   * @param y coordinate
   * @returns TRBL position
   */
  crossingID(x: number, y: number): number {
    const vertical = this.vertical[x];
    const horizontal = this.horizontal[x];
    const horizontalPre = this.horizontal[x - 1];
    return (vertical && vertical[y - 1] ? 8 : 0) +
      (horizontal && horizontal[y] && x < this.horizontal.length - 1 ? 4 : 0) +
      (vertical && vertical[y] && y < this.vertical.length - 1 ? 2 : 0) +
      (horizontalPre && horizontalPre[y] ? 1 : 0);
  }
}
