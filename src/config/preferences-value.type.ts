import { Align, VAlign } from './config.class';

export interface PreferencesValue {
  align: Align;
  boldHeaders: boolean;
  columnHeaderAlign: Align;
  columnHeaderVAlign: VAlign;
  headerBorders: boolean;
  horizontalBorders: boolean;
  numberAlign?: Align;
  rowHeaderAlign: Align;
  rowHeaderVAlign: VAlign;
  tableBorders: boolean;
  valign: VAlign;
  verticalBorders: boolean;
}
