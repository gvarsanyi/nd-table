import { TableRenderData } from '../table-render/table-render-data.class.js';

export function formatHTML(render: TableRenderData, allowStyles?: boolean): string {
  const tab = render.columnHeaders ? '  ' : '';
  let out = '<table>\n';
  for (let y = render.startY; y < render.rows; y++) {
    if (y === -1) {
      out += '  <thead>\n';
    }
    if (render.columnHeaders && !y) {
      out += '  </thead>\n';
      out += '  <tbody>\n';
    }
    out += tab + '  <tr>\n';
    const tag = (y === -1 ? 'th' : 'td');
    for (let x = render.startX; x < render.columns; x++) {
      const styles: string[] = [];
      let prop = '';
      let link1 = '';
      let link2 = '';
      const { options, rendered } = render.data[x][y];
      if (allowStyles) {
        options.color && options.color !== 'default' && styles.push('color: ' + options.color);
        options.bold && styles.push('font-weight: bold');
        options.italic && styles.push('font-style: italic');
      }
      if (options.align) {
        prop += ` align="${options.align}"`;
      }
      prop += ` valign="${options.valign || 'top'}"`;
      if (options.link) {
        link1 = `<a href="${options.link}">`;
        link2 = '</a>';
      }
      const content = rendered.split('<').join('&lt;').split('>').join('&gt;').split('\n').join('<br>');
      out += `${tab}    <${tag}${prop}${styles.length ? ` style="${styles.join('; ')}"` : ''}>${link1}${content}${link2}</${tag}>\n`;
    }
    out += tab + '  </tr>\n';
  }
  if (render.columnHeaders) {
    out += '  </tbody>\n';
  }
  return out + '</table>\n';
}
