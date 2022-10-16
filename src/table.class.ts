import { CellValue } from './cell/cell-value.type';
import { outputFormatterCSV } from './output-formatter/output-formatter-csv';
import { outputFormatterHTML } from './output-formatter/output-formatter-html';
import { outputFormatterJSON } from './output-formatter/output-formatter-json';
import { outputFormatterMarkdown } from './output-formatter/output-formatter-markdown';
import { outputFormatterUTF8 } from './output-formatter/output-formatter-utf8';
import { outputFormatters } from './output-formatters.const';
import { TableBuilder } from './table-builder.class';
import { TableRenderData } from './table-render-data.class';

/**
 * Logical Table
 */
export class Table extends TableBuilder {
  /**
   * Turn 2-dimensinal data array to Table
   * @param data 2-dimensional array of values
   * @param firstRowIsHead indicates column headers
   * @param firstColumnIsHead indicates row headers
   * @returns new Table
   */
  static fromData(data: CellValue[][], firstRowIsHead?: boolean, firstColumnIsHead?: boolean): Table {
    if (!Array.isArray(data)) {
      throw new Error('Provided data is not an array');
    }
    const table = new Table();
    const pushX = firstColumnIsHead ? 1 : 0;
    const pushY = firstRowIsHead ? 1 : 0;
    for (let y = 0 - pushY; y < data.length - pushY; y++) {
      const row = data[y + pushY];
      if (!Array.isArray(data)) {
        throw new Error('Provided data row is not an array at index ' + y);
      }
      for (let x = 0 - pushX; x < row.length - pushX; x++) {
        table.setCell(x, y, row[x + pushX]);
      }
    }
    return table;
  }

  /**
   * Translate Table to ASCII string
   * @param options formatting options
   * @returns Table string
   */
  toASCII(options?: Parameters<typeof outputFormatterUTF8>[1]): string {
    return this.toString('ascii', options);
  }

  /**
   * Translate Table to comma separated values
   * @param options formatting options
   * @returns Table CSV
   */
  toCSV(options?: Parameters<typeof outputFormatterCSV>[1]): string {
    return this.toString('csv', options);
  }

  /**
   * Translate Table to HTML
   * @param options formatting options
   * @returns Table HTML
   */
  toHTML(options?: Parameters<typeof outputFormatterHTML>[1]): string {
    return this.toString('html', options);
  }

  /**
   * Translate Table to JSON string (array of arrays)
   * @param options formatting options
   * @returns Table JSON
   */
  toJSON(options?: Parameters<typeof outputFormatterJSON>[1]): string {
    return this.toString('json', options);
  }

  /**
   * Translate Table to MD
   * @param options formatting options
   * @returns Table Markdown
   */
  toMarkdown(options?: Parameters<typeof outputFormatterMarkdown>[1]): string {
    return this.toString('markdown', options);
  }

  /**
   * Provide a render data snapshot for the current state of the table
   * Use it for custm output formatters
   * @returns render data snapshot
   */
  toRenderData(): TableRenderData {
    return new TableRenderData(this.getSnapshot());
  }

  /**
   * Created formatted table output string
   * @param format output mode
   * @param options output config
   * @returns Table string
   */
  toString<T extends keyof typeof outputFormatters>(format?: T, options: Parameters<(typeof outputFormatters)[T]>[1] = {}): string {
    options = (format && typeof format === 'object' ? format : options);
    format = (outputFormatters[format!] ? format : 'utf8' as T)!;
    return outputFormatters[format](this.toRenderData(), options);
  }

  /**
   * Translate Table to UTF-8 string
   * @param options formatting options
   * @returns Table string
   */
  toUTF8(options?: Parameters<typeof outputFormatterUTF8>[1]): string {
    return this.toString('utf8', options);
  }

  /**
   * Translate Table to tab separated values
   * @returns Table TSV
   */
  toTSV(options?: Parameters<typeof outputFormatterCSV>[1]): string {
    return this.toString('tsv', options);
  }
}

export const NdTable = Table;
export default Table;
