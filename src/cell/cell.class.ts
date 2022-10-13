import { Table } from '../table.class.js';
import { CellOptions } from './cell-options.type';
import { CellValue } from './cell-value.type';

export class Cell {
  constructor(readonly table: Table, public x: number, public y: number, public value?: CellValue, readonly options: CellOptions = {}) {}
}
