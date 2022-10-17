import { Cells } from './cell/cells.class';
import { ConfigValue } from './config/config-value.type';
import { RenderConfig } from './config/render-config.type';

/**
 * Table Config API
 */
export class TableConfig {
  protected readonly _cells = new Cells();

  readonly preferences = this._cells.configs.preferences;

  /**
   * Create TableConfig instance
   */
  constructor() {
    Object.defineProperty(this, '_cells', { enumerable: false, configurable: false, writable: false, value: this._cells });
  }

  /**
   * Get cell config
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @returns cell config
   */
  getCellConfig(x: number, y: number): ConfigValue {
    return this._cells.configs.getsert(x, y).value;
  }

  /**
   * Get meshed (cell > column > row > table) configuration for cell
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @returns cell render config
   */
  getCellRenderConfig(x: number, y: number): RenderConfig {
    return this._cells.configs.getsert(x, y).renderConfig;
  }

  /**
   * Get column config
   * @param x 0-based coordinate index (-1 for row header)
   * @returns column config
   */
  getColumnConfig(x: number): ConfigValue {
    return this._cells.configs.getColumn(x).value;
  }

  /**
   * Get row config
   * @param y 0 based coordinate index (-1 for column header)
   * @returns row config
   */
  getRowConfig(y: number): ConfigValue {
    return this._cells.configs.getRow(y).value;
  }

  /**
   * Get table config
   * @returns table config
   */
  getTableConfig(): ConfigValue {
    return this._cells.configs.table.value;
  }

  /**
   * Update cell config
   * @param x 0-based coordinate index (-1 for row header)
   * @param y 0 based coordinate index (-1 for column header)
   * @param config updates
   * @returns this Table
   */
  setCellConfig(x: number, y: number, config: ConfigValue): this {
    this._cells.configs.upsert(x, y, config);
    return this;
  }

  /**
   * Update column config
   * @param x 0-based coordinate index (-1 for row header)
   * @param config updates
   * @returns this Table
   */
  setColumnConfig(x: number, config: ConfigValue): this {
    this._cells.configs.setColumn(x, config);
    return this;
  }

  /**
   * Update row config
   * @param y 0 based coordinate index (-1 for column header)
   * @param config updates
   * @returns this Table
   */
  setRowConfig(y: number, config: ConfigValue): this {
    this._cells.configs.setRow(y, config);
    return this;
  }

  /**
   * Update table config
   * @param config updates
   * @returns this Table
   */
  setTableConfig(config: ConfigValue): this {
    this._cells.configs.table.value = config;
    return this;
  }
}
