const { equal } = require('assert');
const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { Table } = require('./bin/table.class.js');

const table = new Table('Column A', 'Column B'); // initialize table with optional column headers
table.addRow('abc def\nghi jkl mno pqr', 1); // add a row
table.addRowWithHead('Row Head', 'stu', 2); // add a row with row header
table.addRowWithHead('Another Row Head', { value: 'vwx', bold: true, color: 'red' }, 3); // add another row with row header
table.addRow('yz', { value: 4, link: 'https://osnews.com/' }); // add a last row without headers

const variants = [
  table.toString(),
  table.toString({ ansi: true }),
  table.toString('utf8', { flavor: 'rounded' }),
  table.toString({ ansi: true, flavor: 'rounded' }),
  table.toASCII(),
  table.toASCII({ ansi: true }),
  table.toMarkdown(),
  table.toCSV(),
  table.toTSV(),
  table.toHTML(),
  table.toHTML({ styles: true }),
  table.toJSON(),
  table.toJSON({ compact: true }),
  table.setCellConfig(0, 0, { borderBottom: true }).setColumnConfig(0, { borderRight: true }).toString(),
  table.flip().toString(),
  table.flip().toString()
];

const output = variants.join('\n\n');
writeFileSync('test-result.txt', output);
const expectation = readFileSync('test-expectation.txt', 'utf8');
try {
  equal(output, expectation, 'Output matches expectation');
} catch (e) {
  console.error('Test failed:\n');
  try {
    console.error(execSync('diff test-result.txt test-expectation.txt', { encoding: 'utf8' }));
  } catch (e) {
    console.error(e.stdout);
  }
  process.exit(1);
}
