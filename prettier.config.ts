module.exports = {
  parser: 'typescript',
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  arrowParens: 'avoid',
  endOfLine: 'lf',
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '(.*)modules/(.*)$',
    '(.*)middlewares/(.*)$',
    '(.*)helper/(.*)$',
    '(.*)shared/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['decorators-legacy', 'typescript'],
};