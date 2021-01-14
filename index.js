const path = require("path");
const { parse } = require("postcss");
const { parse: parseValue } = require("postcss-values-parser");
const CleanCSS = require("clean-css");

module.exports = async function (content, _options) {
  const options = { import: true, url: true, minimize: false, ..._options };

  const root = parse(content);
  dependencies = [];

  // Add @import rules as dependencies
  if (options.import) {
    root.walkAtRules((rule) => {
      if (rule.name === "import") {
        const value = parseValue(rule.params);
        const {
          nodes: [source],
        } = value;
        if (source.type === "quoted") {
          // @import "dependency.css"
          dependencies.push({
            rule,
            replace: (rule, dependency) => {
              source.value = `${source.quote}${dependency}${source.quote}`;
              rule.params = value.toString();
            },
            source: source.value.slice(1, -1),
          });
        } else if (source.type === "func" && source.name === "url") {
          const {
            nodes: [first],
          } = source;
          if (first.type === "quoted") {
            // @import url("dependency.css")
            dependencies.push({
              rule,
              replace: (rule, dependency) => {
                first.value = `${first.quote}${dependency}${first.quote}`;
                rule.params = value.toString();
              },
              source: first.value.slice(1, -1),
            });
          } else {
            // @import url(dependency.css)
            dependencies.push({
              rule,
              replace: (rule, dependency) => {
                rule.params = `url(${dependency})`;
              },
              source: source.params.slice(1, -1),
            });
          }
        }
      }
    });
  }

  // Add url() declarations as dependencies
  if (options.url) {
    root.walkDecls((decl) => {
      const value = parseValue(decl.value);
      value.nodes.forEach((node) => {
        if (node.type === "func" && node.name === "url") {
          const {
            nodes: [first],
          } = node;
          if (first.type === "quoted") {
            // url("dependency.jpeg")
            dependencies.push({
              rule: decl,
              replace: (rule, dependency) => {
                first.value = `${first.quote}${dependency}${first.quote}`;
                rule.value = value.toString();
              },
              source: first.value.slice(1, -1),
            });
          } else {
            // url(dependency.jpeg)
            dependencies.push({
              rule: decl,
              replace: (rule, dependency) => {
                rule.value = `url(${dependency})`;
              },
              source: node.params.slice(1, -1),
            });
          }
        }
      });
    });
  }

  // Await dependencies and call replace functions to modify CSS
  for (const { rule, replace, source } of dependencies) {
    const resource = path.join(path.dirname(this.resourcePath), source);
    replace(rule, await this.addDependency(resource));
  }

  // Minimize CSS using CleanCSS
  if (options.minimize) {
    return new CleanCSS({
      inline: false,
      ...options.minimize,
    }).minify(root.toResult().css).styles;
  }

  return root.toResult().css;
};
