# eleventy-load-css

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Prettier][prettier-src]][prettier-href]

Find dependencies in and minify CSS using [eleventy-load](https://github.com/gregives/eleventy-load).

## Getting Started

Firstly, you'll need to install [eleventy-load](https://github.com/gregives/eleventy-load) (if you haven't already) and eleventy-load-css. You'll probably want to use eleventy-load-css in combination with [eleventy-load-html](https://github.com/gregives/eleventy-load-html) and [eleventy-load-file](https://github.com/gregives/eleventy-load-file), so we'll install those as well.

```sh
npm install --save-dev eleventy-load eleventy-load-css eleventy-load-html eleventy-load-file
```

Then you can set up eleventy-load-css using a rule in your eleventy-load options.

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(require("eleventy-load"), {
    rules: [
      {
        test: /\.html$/,
        loaders: [
          {
            loader: require("eleventy-load-html"),
          },
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          {
            loader: require("eleventy-load-css"),
            options: {
              minimize: true,
            },
          },
          {
            loader: require("eleventy-load-file"),
            options: {
              name: "[hash].css",
            },
          },
        ],
      },
    ],
  });
};
```

Now that you've set up eleventy-load-css, you can reference a CSS file from an HTML template and eleventy-load-css will process it for you.

```html
<link rel="stylesheet" href="styles.css" />
```

## Options

| Name                        | Type              | Default | Description                                                            |
| --------------------------- | ----------------- | ------- | ---------------------------------------------------------------------- |
| [**`url`**](#url)           | `Boolean`         | `true`  | Processes `url` dependencies                                           |
| [**`import`**](#import)     | `Boolean`         | `true`  | Processes `@import` dependencies                                       |
| [**`minimize`**](#minimize) | `Boolean\|Object` | `false` | Minimize using [CleanCSS](https://github.com/jakubpawlowicz/clean-css) |

### `url`

Type: `Boolean` Default: `true`.

If `true`, processes `url` functions as eleventy-load dependencies.

```scss
// eleventy-load will process cat.jpg if `url` is true
background-image: url("cat.jpg");
```

### `import`

Type: `Boolean` Default: `true`

If `true`, processes `@import` rules as eleventy-load dependencies.

```scss
// eleventy-load will process styles.css if `import` is true
@import "styles.css";
```

### `minimize`

Type: `Boolean|Object` Default: `false`

If `true` or an `Object`, eleventy-load-css will minimize CSS using [CleanCSS](https://github.com/jakubpawlowicz/clean-css). If an `Object`, these will be provided to CleanCSS as options.

```js
{
  loader: require("eleventy-load-css"),
  options: {
    minimize: {
      level: 2 // Use CleanCSS level 2 optimisations
    }
  },
},
```

<!-- References -->

[npm-version-src]: https://img.shields.io/npm/v/eleventy-load-css/latest.svg
[npm-version-href]: https://npmjs.com/package/eleventy-load-css
[npm-downloads-src]: https://img.shields.io/npm/dt/eleventy-load-css.svg
[npm-downloads-href]: https://npmjs.com/package/eleventy-load-css
[license-src]: https://img.shields.io/npm/l/eleventy-load-css.svg
[license-href]: https://npmjs.com/package/eleventy-load-css
[prettier-src]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[prettier-href]: https://github.com/prettier/prettier
