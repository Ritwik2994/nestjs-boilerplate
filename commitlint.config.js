module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Jira ticket validation
    'header-pattern': [
      2,
      'always',
      /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([A-Z]+-\d+\))?: .+$/,
    ],

    // Enforce Jira ticket in scope
    'scope-case': [2, 'always', 'upper-case'],
    'scope-pattern': [2, 'always', /^[A-Z]+-\d+$/],

    // Type and case rules
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
    ],
    'type-case': [2, 'always', 'lower-case'],

    // Subject rules
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 72],

    // Additional custom rules
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
};
