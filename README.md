# nd-table
Node.js Table builder for:
- console/terminal (ascii, utf8, ansi)
- MarkDown (md)
- HTML
- CSV, TSV
- pre-rendered data for your custom outputs
Borders, multiline cells, 

## Building a table
```javascript
import { Table } from 'nd-table';

// initialize table with optional column headers
const table = new Table('Column A', 'Column B');

// add a row
table.addRow('abc def\nghi jkl mno pqr', 1);

// add a row with row header
table.addRowWithHead('Row Head', 'stu', 2);

// add another row with row header. Value is specified with options for "Column A"
table.addRowWithHead('Another Row Head', { value: 'vwx', bold: true, color: 'red' }, 3);

// add a last row without headers. Specifies a link for "Column B". Links are supported in Markdown and HTML outputs.
table.addRow('yz', { value: 4, link: 'https://osnews.com/' });

// print the table
console.log(table.toString());
//                    ┌──────────────────────────┐
//                    │ Column A        Column B │
// ┌──────────────────┼──────────────────────────┤
// │                  │ abc def                1 │
// │                  │ ghi jkl mno pqr          │
// │         Row Head │ stu                    2 │
// │ Another Row Head │ vwx                    3 │
// │                  │ yz                     4 │
// └──────────────────┴──────────────────────────┘

```

### Output formats
```javascript
// For terminal, uses UTF-8 box drowing characters for borders
table.toString(/* arg1: true to allow ANSI styles, arg2: true to get rounded edges */);

// For terminal with no UTF-8 support
table.toASCII(/* pass true to allow ANSI styles */);

// Markdown
table.toMarkdown();

// HTML
table.toHTML(/* pass true to allow styles */);

// Excel compatbile CSV
table.toCSV();

// TSV (CSV with tab separation)
table.toCSV();

// Get pre-processed render data and use it with your own custom output formatter
myCustomOutput(table.toRenderData());
```

### Coordinates
Columns and rows are in a 0-based index that excludes the optional headers
**x = -1** is the row header
**y = -1** is the column header

### Headers
You can fetch the current header values:
```javascript
const columnHeaders = table.columnHeaders(); // returns undefined for no headers or an array of header values
const rowHeaders = table.rowHeaders(); // returns undefined for no headers or an array of header values
```

Update all headers at once:
```javascript
table.columnHeaders([/* values or empty array for removing header */]);
table.rowHeaders([/* values or empty array for removing header */]);
```

### Set options
Options can be set any time (even before adding content) for any _cell_ (coordinates x, y), _column_ (coordinate x), _row_ (coordinate y), or the _table_. This is also the order of precedence (except for borders that are specific to each entity.)

```javascript
// For a cell (x, y)
table.cellOptions(1, -1, { bold: true }); // coordinate x, coordinate y, options

// For a column (x)
table.columnOptions(1, { bold: true }); // coordinate x, options

// For a row (y)
table.rowOptions(1, { bold: true }); // coordinate y, options

// For the table
table.tableOptions({ bold: true }); // options
```
