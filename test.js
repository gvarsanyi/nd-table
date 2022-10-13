const { equal } = require('assert');
const { readFileSync } = require('fs');
const { Table } = require('./bin/table.class.js');

const table = new Table('Column A', 'Column B'); // initialize table with optional column headers
table.addRow('abc def\nghi jkl mno pqr', 1); // add a row
table.addRowWithHead('Row Head', 'stu', 2); // add a row with row header
table.addRowWithHead('Another Row Head', { value: 'vwx', bold: true, color: 'red' }, 3); // add another row with row header
table.addRow('yz', { value: 4, link: 'https://osnews.com/' }); // add a last row without headers

const variants = [
  table.toString(),
  table.toString(true),
  table.toString(false, true),
  table.toString(true, true),
  table.toASCII(),
  table.toASCII(true),
  table.toMarkdown(),
  table.toCSV(),
  table.toTSV(),
  table.toHTML(false),
  table.toHTML(true)
];

const output = variants.join('\n\n');
const expectation = readFileSync('test-expectation.txt', 'utf8');
equal(output, expectation, 'Output matches expectation');

console.log(output);
