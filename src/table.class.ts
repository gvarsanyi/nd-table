import { cellOptionsFilter } from './cell/cell-options-filter.js';
import { cellOptionsFlipBorder } from './cell/cell-options-flip-borders.js';
import { CellOptions } from './cell/cell-options.type';
import { cellPosCheck } from './cell/cell-pos-check.js';
import { cellValueAndOptions, CellValueOrValueWithOptions } from './cell/cell-value-and-options.js';
import { CellValue } from './cell/cell-value.type';
import { Cell } from './cell/cell.class.js';
import { formatCSV } from './format/format-csv.js';
import { formatHTML } from './format/format-html.js';
import { formatMarkdown } from './format/format-markdown.js';
import { formatTerminal } from './format/format-terminal.js';
import { TableRenderData } from './table-render/table-render-data.class.js';

/**
 * Table abstraction
 */
export class Table {
  protected readonly _cells: Cell[] = [];
  protected readonly _tableOptions = {};

  protected _columnOptions: { [col: number]: CellOptions } = {};
  protected _rowOptions: { [row: number]: CellOptions } = {};

  /**
   * Create Table instance
   * @param columnHeaders optionally set columnHeaders
   */
  constructor(...columnHeaders: CellValueOrValueWithOptions[]) {
    if (columnHeaders.length) {
      this.columnHeaders(columnHeaders);
    }
    this.cellOptions(-1, -1, { align: 'right', borderLeft: false, borderTop: false });
  }

  /**
   * Current number of columns (the value of the highest 'x' position of any cells + 1)
   */
  get columns(): number {
    let columns = 0;
    this._cells.forEach((cell) => columns = cell.value != null ? Math.max(columns, cell.x + 1) : columns);
    return columns;
  }

  /**
   * Current number of rows (the value of the highest 'y' position of any cells + 1)
   */
  get rows(): number {
    let rows = 0;
    this._cells.forEach((cell) => rows = cell.value != null ? Math.max(rows, cell.y + 1) : rows);
    return rows;
  }

  /**
   * Append a row to the end of the table with the provided cell values (and possibly options)
   * @param values primitive value or { value, ...options }
   * @returns the Table
   */
  addRow(...values: CellValueOrValueWithOptions[]): this {
    const y = this.rows;
    const len = values.length;
    for (let x = 0; x < len; x++) {
      this.cell(x, y, ...cellValueAndOptions(values[x]));
    }
    return this;
  }

  /**
   * Append a row to the end of the table with the provided row header and cell values (and possibly options)
   * @param header primitive value or { value, ...options }
   * @param values primitive value or { value, ...options }
   * @returns the Table
   */
  addRowWithHead(header?: CellValueOrValueWithOptions, ...values: CellValueOrValueWithOptions[]): this {
    const y = this.rows;
    this.cell(-1, y, ...cellValueAndOptions(header));
    const len = values.length;
    for (let x = 0; x < len; x++) {
      this.cell(x, y, ...cellValueAndOptions(values[x]));
    }
    return this;
  }

  /**
   * Sets borderBottom: true option on the last row
   * @returns this Table
   */
  addSeparator(): this {
    return this.rowOptions(this.rows - 1, { borderBottom: true });
  }

  /**
   * Get cell value
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @returns cell value
   */
  cell(x: number, y: number): CellValue;
  /**
   * Update cell value and options
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @param value new value
   * @param options option updates
   * @returns this Table
   */
  cell(x: number, y: number, value: CellValue, options?: CellOptions): this;
  /**
   * Get cell value or update cell value and options
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @param value new value (for update)
   * @param options option updates
   * @returns cell value (for getter) or this Table (for update)
   */
  cell(x: number, y: number, value?: CellValue, options: CellOptions = {}): CellValue | this {
    cellPosCheck('x', x);
    cellPosCheck('y', y);
    const found = this._cells.find((cell) => cell.x === x && cell.y === y);
    if (arguments.length <= 2) {
      return found?.value;
    }
    options = cellOptionsFilter(options);
    if (typeof value === 'function' || typeof value === 'object' || typeof value === 'symbol') {
      value = String(value);
    }
    if (found) {
      found.value = value;
      Object.assign(found.options, options);
    } else {
      this._cells.push(new Cell(this, x, y, value, options));
      this._sortCells();
    }
    return this;
  }

  /**
   * Get cell options
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @returns cell options
   */
  cellOptions(x: number, y: number): CellOptions;
  /**
   * Update cell options
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @param options option updates
   * @returns this Table
   */
  cellOptions(x: number, y: number, options: CellOptions): this;
  /**
   * Get or update cell options
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @param options option updates (for update)
   * @returns cell options (for getter) or this Table (for update)
   */
  cellOptions(x: number, y: number, options?: CellOptions): CellOptions | this {
    cellPosCheck('x', x);
    cellPosCheck('y', y);
    const found = this._cells.find((cell) => cell.x === x && cell.y === y);
    if (!found) {
      if (!options) {
        return {};
      }
      return this.cell(x, y, undefined, options);
    }
    return this._accessOptions(found.options, options, x, y);
  }

  /**
   * Get column headers
   * @returns undefined (for no headers) or array of header values
   */
  columnHeaders(): CellValue[] | undefined;
  /**
   * Update column headers
   * @param headers primitive value or { value, ...options }
   * @returns this Table
   */
  columnHeaders(headers: CellValueOrValueWithOptions[]): this;
  /**
   * Get or update column headers
   * @param headers for update: primitive value or { value, ...options }
   * @returns undefined (for getter: no headers) headers (for getter: has headers) or this Table (for update)
   */
  columnHeaders(headers?: CellValueOrValueWithOptions[]): CellValue[] | undefined | this {
    return this._accessHeaders(false, headers);
  }

  /**
   * Get column options
   * @param x 0-based coordinate index (-1 for row header)
   * @returns column options
   */
  columnOptions(x: number): CellOptions;
  /**
   * Update column options
   * @param x 0-based coordinate index (-1 for row header)
   * @param options option updates
   * @returns this Table
   */
  columnOptions(x: number, options: CellOptions): this;
  /**
   * Get or update column options
   * @param x 0-based coordinate index (-1 for row header)
   * @param options option updates (for update)
   * @returns column options (for getter) or this Table (for update)
   */
  columnOptions(x: number, options?: CellOptions): CellOptions | this {
    cellPosCheck('x', x);
    return this._accessOptions((this._columnOptions[x] = this._columnOptions[x] || {}), options, x);
  }

  /**
   * Flips x and y axes
   * @param flipBorders borders left<->top + right<->bottom
   * @returns this Table
   */
  flip(flipBorders = true): this {
    if (flipBorders) {
      cellOptionsFlipBorder(this._tableOptions);
      const columns = this.columns;
      for (let x = (this.rowHeaders() ? -1 : 0); x < columns; x++) {
        this._columnOptions[x] && cellOptionsFlipBorder(this._columnOptions[x]);
      }
      const rows = this.rows;
      for (let y = (this.columnHeaders() ? -1 : 0); y < rows; y++) {
        this._rowOptions[y] && cellOptionsFlipBorder(this._rowOptions[y]);
      }
    }
    [this._columnOptions, this._rowOptions] = [this._rowOptions, this._columnOptions];
    this._cells.forEach((cell) => {
      const { x, y } = cell;
      cell.x = y;
      cell.y = x;
      flipBorders && cellOptionsFlipBorder(cell.options);
    });
    this._sortCells();
    return this;
  }

  /**
   * Get row headers
   * @returns undefined (for no headers) or array of header values
   */
  rowHeaders(): CellValue[] | undefined;
  /**
   * Update column headers
   * @param headers primitive value or { value, ...options }
   * @returns this Table
   */
  rowHeaders(headers: CellValueOrValueWithOptions[]): this;
  /**
   * Get or update row headers
   * @param headers for update: primitive value or { value, ...options }
   * @returns undefined (for getter: no headers) headers (for getter: has headers) or this Table (for update)
   */
  rowHeaders(headers?: CellValueOrValueWithOptions[]): CellValue[] | undefined | this {
    return this._accessHeaders(true, headers);
  }

  /**
   * Get row options
   * @param y 0 based coordinate index (-1 for column header)
   * @returns row options
   */
  rowOptions(y: number): CellOptions;
  /**
   * Update row options
   * @param y 0 based coordinate index (-1 for column header)
   * @param options option updates
   * @returns this Table
   */
  rowOptions(y: number, options: CellOptions): this;
  /**
   * Get or update row options
   * @param y 0 based coordinate index (-1 for column header)
   * @param options option updates (for update)
   * @returns row options (for getter) or this Table (for update)
   */
  rowOptions(y: number, options?: CellOptions): CellOptions | this {
    cellPosCheck('y', y);
    return this._accessOptions((this._rowOptions[y] = this._rowOptions[y] || {}), options, undefined, y);
  }

  /**
   * Get table options
   * @returns table options
   */
  tableOptions(): CellOptions;
  /**
   * Update table options
   * @param options option updates
   * @returns this Table
   */
  tableOptions(options: CellOptions): this;
  /**
   * Get or update table options
   * @param options option updates (for update)
   * @returns table options (for getter) or this Table (for update)
   */
  tableOptions(options?: CellOptions): CellOptions | this {
    return this._accessOptions(this._tableOptions, options);
  }

  /**
   * Translate Table to ASCII string
   * @param allowANSIStyles add terminal colors
   * @returns Table string
   */
  toASCII(allowANSIStyles?: boolean): string {
    return formatTerminal(new TableRenderData(this), 'ascii', allowANSIStyles);
  }

  /**
   * Translate Table to comma separated values
   * @returns Table CSV
   */
  toCSV(): string {
    return formatCSV(new TableRenderData(this));
  }

  /**
   * Translate Table to HTML
   * @param allowStyles allow style="" property and its values (color, italic, bold)
   * @returns Table HTML
   */
  toHTML(allowStyles = true): string {
    return formatHTML(new TableRenderData(this), allowStyles);
  }

  /**
   * Translate Table to MD
   * @returns Table Markdown
   */
  toMarkdown(): string {
    return formatMarkdown(new TableRenderData(this));
  }

  /**
   * Provide a render data snapshot for the current state of the table
   * Use it for custm output formatters
   * @returns render data snapshot
   */
  toRenderData(): TableRenderData {
    return new TableRenderData(this);
  }

  /**
   * Translate Table to UTF-8 string
   * @param allowANSIStyles add terminal colors
   * @param rounded rounded edges for borders
   * @returns Table string
   */
  toString(allowANSIStyles?: boolean, rounded?: boolean): string {
    return formatTerminal(new TableRenderData(this), rounded ? 'rounded' : 'utf8', allowANSIStyles);
  }

  /**
   * Translate Table to tab separated values
   * @returns Table TSV
   */
  toTSV(): string {
    return formatCSV(new TableRenderData(this), true);
  }

  private _accessHeaders(vertical: boolean, headers?: CellValueOrValueWithOptions[]): this | CellValue[] | undefined {
    if (headers?.length) {
      if (!Array.isArray(headers)) {
        throw new Error('"headers" must be an array');
      }
      for (let i = 0; i < headers.length; i++) {
        this.cell((vertical ? -1 : i), (vertical ? i : -1), ...cellValueAndOptions(headers[i]));
      }
      return this;
    }
    const len = (vertical ? this.rows : this.columns);
    const list: CellValue[] = [];
    for (let i = 0; i < len; i++) {
      list.push(this.cell((vertical ? -1 : i), (vertical ? i : -1)));
    }
    while (list.length && list[list.length - 1] == null) {
      list.pop();
    }
    return list.length ? list : undefined;
  }

  private _accessOptions(target: CellOptions, options?: CellOptions, x?: number, y?: number): this | CellOptions {
    if (options) {
      options = cellOptionsFilter(options);
      Object.assign(target, options);
      return this;
    } else {
      const defaults: CellOptions = {};
      if (x == null && y == null) { // table
        defaults.borderBottom = defaults.borderLeft = defaults.borderRight = defaults.borderTop = true;
      } else if (x == null) { // row
        if (y === -1) { // header
          defaults.bold = defaults.borderBottom = true;
        }
      } else if (y == null) { // column
        if (x === -1) { // header
          defaults.bold = defaults.borderRight = true;
          defaults.align = 'right';
        }
      }
      return Object.assign(defaults, target);
    }
  }

  private _sortCells(): void {
    this._cells.sort((a, b) => a.y === b.y ? (a.x < b.x ? -1 : 1) : (a.y < b.y ? -1 : 1));
  }
}

export const NdTable = Table;
export default Table;
