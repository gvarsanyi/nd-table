import { outputFormatterASCII } from './output-formatter/output-formatter-ascii';
import { outputFormatterCSV } from './output-formatter/output-formatter-csv';
import { outputFormatterHTML } from './output-formatter/output-formatter-html';
import { outputFormatterJSON } from './output-formatter/output-formatter-json';
import { outputFormatterMarkdown } from './output-formatter/output-formatter-markdown';
import { outputFormatterTSV } from './output-formatter/output-formatter-tsv';
import { outputFormatterUTF8 } from './output-formatter/output-formatter-utf8';

export const outputFormatters = {
  ascii: outputFormatterASCII,
  csv: outputFormatterCSV,
  html: outputFormatterHTML,
  json: outputFormatterJSON,
  markdown: outputFormatterMarkdown,
  tsv: outputFormatterTSV,
  utf8: outputFormatterUTF8
} as const;
