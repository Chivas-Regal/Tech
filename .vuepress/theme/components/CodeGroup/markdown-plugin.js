const container = require('markdown-it-container');

module.exports = (md) => {
  md.use(container, 'code-group', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        return `<CodeGroup>\n`;
      } else {
        return `</CodeGroup>\n`;
      }
    }
  });

  md.use(container, 'code-group-item', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const title = tokens[idx].info
          .trim()
          .replace(/^code-group-item\s+/, '')
          .trim();
        return `<CodeGroupItem title="${title}">\n\n`;
      } else {
        return `\n\n</CodeGroupItem>\n`;
      }
    }
  });
};
