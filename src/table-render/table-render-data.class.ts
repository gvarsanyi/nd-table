import { CellOptions } from '../cell/cell-options.type';
import { cellRenderOptions } from '../cell/cell-render-options.js';
import { CellRenderOptions } from '../cell/cell-render-options.type';
import { CellValue } from '../cell/cell-value.type';
import { ReadonlyTable } from '../readonly-table.class.js';
import { Table } from '../table.class.js';
import { TableRenderBorderData } from './table-render-border-data.class.js';
import { tableRenderBorderSet } from './table-render-border-set.js';
import { tableRenderCellGrids } from './table-render-cell-grids.js';
import { tableRenderCellsAlign } from './table-render-cells-align.js';
import { tableRenderCellsVAlign } from './table-render-cells-valign.js';
import { tableRenderColumnAlign } from './table-render-column-align.js';

/**
 * Render information for custom table formatters
 */
export class TableRenderData implements ReadonlyTable {
  /** border information in a grid logic */
  readonly borders: TableRenderBorderData;

  /** copy of original cell options on (x, y) coordinates */
  readonly cellOptions: CellOptions[][];

  /** copy of original cell values on (x, y) coordinates */
  readonly cells: CellValue[][];

  /** column header values */
  readonly columnHeaders?: CellValue[];

  /** copy of original column options on (x) coordinate */
  readonly columnOptions: CellOptions[];

  /** processed column width on (x) coordinate */
  readonly columnWidth: number[] = [];

  /** number of columns (excluding header) */
  readonly columns: number;

  /** processed data on (x, y) coordinates. Contains "lines[]"" for multiline, "rendered" sring value, and blended "options" */
  readonly data: { grid: ([number, number] | string)[][], lines: string[]; options: CellRenderOptions; rendered: string }[][] = [];

  /** row header values */
  readonly rowHeaders?: CellValue[];

  /** processed row height (line count) on (y) coordinate */
  readonly rowHeight: number[] = [];

  /** copy of original row options on (y) coordinate */
  readonly rowOptions: CellOptions[];

  /** row count (excluding header) */
  readonly rows: number;

  /** -1 when row headers are present, 0 otherwise */
  readonly startX: number;

  /** -1 when column headers are present, 0 otherwise */
  readonly startY: number;

  /** copy of original table options */
  readonly tableOptions: CellOptions;

  /**
   * Instantiate render data
   * @param table snapshot source
   */
  constructor(table: Table) {
    const readonlyTable = new ReadonlyTable(table);
    this.cellOptions = readonlyTable.cellOptions;
    this.cells = readonlyTable.cells;
    this.columnHeaders = readonlyTable.columnHeaders;
    this.columnOptions = readonlyTable.columnOptions;
    this.columns = readonlyTable.columns;
    this.rowHeaders = readonlyTable.rowHeaders;
    this.rowOptions = readonlyTable.rowOptions;
    this.rows = readonlyTable.rows;
    this.startX = readonlyTable.startX;
    this.startY = readonlyTable.startY;
    this.tableOptions = readonlyTable.tableOptions;
    this.borders = new TableRenderBorderData(this);
    for (let x = this.startX; x < this.columns; x++) {
      this.data[x] = [];
    }
    for (let x = this.startX; x < this.columns; x++) {
      for (let y = this.startY; y < this.rows; y++) {
        tableRenderBorderSet(this, x, y);
        const [renderer, renderOptions] = cellRenderOptions(this, x, y);
        const rendered = renderer(this.cells[x][y], x, y, renderOptions, readonlyTable);
        const maxHeight = Math.min(renderOptions.maxHeight || 1000, renderOptions.height || 1000);
        let renderedLines = rendered.split('\n');
        if (renderedLines.length > maxHeight) {
          renderedLines = renderedLines.slice(0, renderOptions.maxHeight);
        }
        this.rowHeight[y] = Math.max(this.rowHeight[y] || 0, renderedLines.length);
        const rerendered = renderedLines.join('\n');
        const maxWidth = Math.min(renderOptions.maxWidth || 1000, renderOptions.width || 1000);
        this.data[x][y] = {
          grid: [],
          lines: rerendered.split('\n').map((line) => {
            const origLen = line.length;
            const len = Math.min(maxWidth, origLen);
            this.columnWidth[x] = Math.max(this.columnWidth[x] || 0, len);
            return line.substring(0, len);
          }),
          options: renderOptions,
          rendered
        };
      }
      tableRenderBorderSet(this, x, this.rows);
    }
    for (let y = this.startY; y < this.rows; y++) {
      tableRenderBorderSet(this, this.columns, y);
    }
    tableRenderColumnAlign(this);
    tableRenderCellsVAlign(this);
    tableRenderCellsAlign(this);
    tableRenderCellGrids(this);
  }
}
