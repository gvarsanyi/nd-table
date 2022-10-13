import { CellOptions } from './cell/cell-options.type';
import { CellValue } from './cell/cell-value.type';
import { Table } from './table.class.js';

export class ReadonlyTable {
  readonly cellOptions: CellOptions[][];
  readonly cells: CellValue[][];
  readonly columnHeaders?: CellValue[];
  readonly columnOptions: CellOptions[];
  readonly columns: number;
  readonly rowHeaders?: CellValue[];
  readonly rowOptions: CellOptions[];
  readonly rows: number;
  readonly startX: number;
  readonly startY: number;
  readonly tableOptions: CellOptions;

  constructor(table: Table) {
    this.columns = table.columns;
    this.rows = table.rows;
    this.columnHeaders = table.columnHeaders();
    this.startY = this.columnHeaders ? -1 : 0;
    this.rowHeaders = table.rowHeaders();
    this.startX = this.rowHeaders ? -1 : 0;
    this.tableOptions = table.tableOptions();
    this.cellOptions = [];
    this.cells = [];
    this.columnOptions = [];
    for (let x = this.startX; x < this.columns; x++) {
      this.columnOptions[x] = table.columnOptions(x);
      this.cellOptions[x] = [];
      this.cells[x] = [];
      for (let y = this.startY; y < this.rows; y++) {
        this.cellOptions[x][y] = table.cellOptions(x, y);
        this.cells[x][y] = table.cell(x, y);
      }
    }
    this.rowOptions = [];
    for (let y = this.startY; y < this.rows; y++) {
      this.rowOptions[y] = table.rowOptions(y);
    }
  }
}
