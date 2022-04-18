const mix = require("laravel-mix");
const path = require("path");

// Determine system directory separator
const slash = `\\${path.sep}`;

const escapeRegExp = (str) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
const generateModuleRegExp = (str) => escapeRegExp(str.replace("/", path.sep));

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
  register(transpile = true) {
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
    return rules.filter(
      (rule) => this.ruleTransformsJs(rule) && this.ruleUsesBabel(rule)
    );
  }

  ruleTransformsJs({ test = '' }) {
    const pattern = test.toString();
    return pattern.includes(".js") || pattern.match(/\b(cjs|mjs|jsx?|tsx?)\b/);
  }

  ruleUsesBabel({ use = [] }) {
    return use.some(({ loader }) =>
      loader.match(new RegExp(`(^|${slash})babel-loader(${slash}|$)`))
    );
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
      const includeModules = transpile.map(generateModuleRegExp).join("|");
      return new RegExp(`node_modules${slash}(?!(${includeModules})${slash})`);
    }
  }
}

mix.extend("transpileNodeModules", new TranspileNodeModules());
