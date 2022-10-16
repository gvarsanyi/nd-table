import { ConfigValue } from './config-value.type';
import { Configs } from './configs.class';
import { RenderConfig } from './render-config.type';

export const CONFIG_ALIGN = ['left', 'center', 'right'] as const;
export const CONFIG_BORDERS = ['borderBottom', 'borderLeft', 'borderRight', 'borderTop'] as const;
export const CONFIG_COLORS = ['black', 'blue', 'cyan', 'default', 'green', 'magenta', 'red', 'white', 'yellow'] as const;
export const CONFIG_VALIGN = ['top', 'middle', 'bottom'] as const;
export const CONFIG_SIZES = ['width', 'height', 'maxWidth', 'maxHeight'] as const;

export type BorderProperty = (typeof CONFIG_BORDERS)[number];

const CONFIG_BORDER_FLIP_PAIRS: { [key in BorderProperty]: BorderProperty } = {
  borderBottom: 'borderRight',
  borderLeft: 'borderTop',
  borderRight: 'borderBottom',
  borderTop: 'borderLeft'
};

/** [axis, isStarter, prop-of-cells-for-edge] */
const CONFIG_BORDER_REFS: { [key in BorderProperty]: ['x' | 'y', boolean, 'columns' | 'rows' | 'startX' | 'startY'] } = {
  borderBottom: ['y', false, 'rows'],
  borderLeft: ['x', true, 'startX'],
  borderRight: ['x', false, 'columns'],
  borderTop: ['y', true, 'startY']
};

export class Config {
  constructor(protected readonly parent: Configs, public x: number, public y: number, protected _value: ConfigValue) {}

  get renderConfig(): RenderConfig {
    const columnConfig = this.parent.getColumn(this.x).value;
    const rowConfig = this.parent.getRow(this.y).value;
    const mesh = Object.assign(this.parent.table.value, rowConfig, columnConfig, this.value);
    const { startX, startY } = this.parent.cells;
    mesh.borderBottom = this.parent.getsert(this.x, this.y + 1).borderValue('borderTop') || this.borderValue('borderBottom');
    mesh.borderLeft = (this.x > startX ?
      this.parent.getsert(this.x - 1, this.y).borderValue('borderRight') : undefined) || this.borderValue('borderLeft');
    mesh.borderRight = this.parent.getsert(this.x + 1, this.y).borderValue('borderLeft') || this.borderValue('borderRight');
    mesh.borderTop = (this.y > startY ?
      this.parent.getsert(this.x, this.y - 1).borderValue('borderBottom') : undefined) || this.borderValue('borderTop');
    return mesh as RenderConfig;
  }

  /** read and add defaults */
  get value(): ConfigValue {
    const defaults: ConfigValue = {};
    if (this.x == null && this.y == null) { // table
      defaults.borderTop = defaults.borderRight = defaults.borderLeft = defaults.borderBottom = true;
    } else if (this.x == null) { // row
      if (this.y === -1) { // header
        defaults.bold = defaults.borderBottom = true;
      }
    } else if (this.y == null) { // column
      if (this.x === -1) { // header
        defaults.bold = defaults.borderRight = true;
        defaults.align = 'right';
      }
    } else if (this.x === -1 && this.y === -1) { // no top/left borders for -1,-1 by default
      defaults.borderLeft = false;
      defaults.borderTop = false;
    }
    return Object.assign(defaults, this._value);
  }

  /** sanitze and update */
  set value(options: ConfigValue) {
    const sane: ConfigValue = {};
    if (options && typeof options === 'object') {
      if ('align' in options) {
        const align = options.align;
        sane.align = CONFIG_ALIGN.includes(align!) ? align : undefined;
      }
      if ('valign' in options) {
        const valign = options.valign;
        sane.valign = CONFIG_VALIGN.includes(valign!) ? valign : undefined;
      }
      if ('color' in options) {
        const color = options.color;
        sane.color = CONFIG_COLORS.includes(color!) ? color : undefined;
      }
      if ('bold' in options) {
        sane.bold = !!options.bold;
      }
      if ('italic' in options) {
        sane.italic = !!options.italic;
      }
      if ('link' in options) {
        sane.link = typeof options.link === 'string' && options.link.trim() || undefined;
      }
      for (const key of CONFIG_BORDERS) {
        if (key in options) {
          sane[key] = !!options[key];
        }
      }
      for (const key of CONFIG_SIZES) {
        if (key in options) {
          const nval = Math.round(+options[key]!);
          sane[key] = nval > 0 ? nval : undefined;
        }
      }
      if ('renderer' in options) {
        const fn = options.renderer;
        sane.renderer = typeof fn === 'function' ? fn : undefined;
      }
    }
    Object.assign(this._value, sane);
  }

  borderValue(prop: BorderProperty): boolean {
    const [axis, isStarter, edgeProp] = CONFIG_BORDER_REFS[prop];
    const isEdge = (this[axis] === this.parent.cells[edgeProp] - (isStarter ? 0 : 1));
    return (this.value[prop] ??
      (axis === 'x' || isEdge ? this.parent.getColumn(this.x).value[prop] : undefined) ??
      (axis === 'y' || isEdge ? this.parent.getRow(this.y).value[prop] : undefined) ??
      (isEdge ? this.parent.table.value[prop] : undefined)) ||
      false;
  }

  clear(): void {
    for (const key of Object.keys(this._value) as (keyof ConfigValue)[]) {
      delete this._value[key];
    }
  }

  flipBorders(): void {
    const tmp: ConfigValue = {};
    for (const key of Object.keys(CONFIG_BORDER_FLIP_PAIRS) as BorderProperty[]) {
      if (this._value[key] != null) {
        tmp[CONFIG_BORDER_FLIP_PAIRS[key]] = this._value[key];
        delete this._value[key];
      }
    }
    Object.assign(this._value, tmp);
  }
}
