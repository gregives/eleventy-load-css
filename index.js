const css = require("css");
const detective = require("detective-postcss");
const isUrl = require("is-url");

// Define import string
const IMPORT = "@import";

module.exports = async function (content, options = {}) {
  const imports = css
    .parse(content)
    .stylesheet.rules.filter((rule) => rule.type === "import");

  const parsed = content.split("\n");

  for (const rule of imports) {
    const [file] = detective(`${IMPORT} ${rule.import}`, { url: true });

    if (file && !isUrl(file)) {
      const {
        position: { start, end },
      } = rule;

      // Ignore imports over multiple lines for now
      if (start.line !== end.line)
        throw new Error("Imports over multiple lines are not handled yet");

      // Position is 1-indexed
      const line = start.line - 1;

      // Replace import with return of dependency
      parsed[line] = [
        parsed[line].slice(0, start.column + IMPORT.length),
        parsed[line]
          .slice(start.column + IMPORT.length, end.column)
          .replace(file, await this.addDependency(file)),
        parsed[line].slice(end.column),
      ].join("");
    }
  }

  return parsed.join("\n");
};
