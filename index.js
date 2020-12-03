const mix = require("laravel-mix");
const path = require('path');

const escapeRegExp = (str) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
const slashPattern = `\\${path.sep}`;

/**
 * Babel-transpile dependencies inside `node_modules`
 */
class TranspileNodeModules {
  constructor() {
    this.transpileModules = [];
  }

  /**
   * The optional name to be used when called by Mix.
   * Defaults to the class name.
   *
   * @return {String|Array}
   */
  name() {
    return ["transpile", "transpileNodeModules"];
  }

  /**
   * Register the component.
   *
   * @param {Boolean|Array} transpile
   */
  register(transpile) {
    if (Array.isArray(transpile)) {
      if (!Array.isArray(this.transpileModules)) {
        this.transpileModules = transpile;
      } else {
        this.transpileModules = this.transpileModules.concat(transpile);
      }
    } else {
      this.transpileModules = Boolean(transpile);
    }
  }

  /**
   * Override the generated webpack configuration.
   *
   * @param {Object} webpackConfig
   */
  webpackConfig(webpackConfig) {
    const rules = this.findBabelRules(webpackConfig);
    const exclude = this.generateExcludePattern();

    rules.forEach((module) => (module.exclude = exclude));
  }

  /**
   * Find all babel rules
   *
   */
  findBabelRules(webpackConfig) {
    const { rules } = webpackConfig.module;
    return rules.filter(({ test, use }) => {
      return (
        test.toString().includes(".js") &&
        use.find(({ loader }) => loader === "babel-loader")
      );
    });
  }

  /**
   * Generate the exclude pattern for babel-loader
   *
   */
  generateExcludePattern() {
    const transpile = this.transpileModules;

    if (transpile === true) {
      return /(\b@babel|core-js|webpack|(css)-loader)\b/;
    } else if (!transpile || (Array.isArray(transpile) && !transpile.length)) {
      return /node_modules/;
    } else {
      const includeModules = transpile.map(escapeRegExp).join("|");
      return new RegExp(`node_modules${slashPattern}(?!(${includeModules})${slashPattern})`);
    }
  }
}

mix.extend("transpileNodeModules", new TranspileNodeModules());
