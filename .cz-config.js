module.exports = {
  types: [
    { value: 'feat', name: 'feat:     ✨ A new feature' },
    { value: 'fix', name: 'fix:      🐛 A bug fix' },
    { value: 'docs', name: 'docs:     📝 Documentation changes' },
    { value: 'style', name: 'style:    💄 Code style changes' },
    { value: 'refactor', name: 'refactor: 🔨 Code refactoring' },
    { value: 'perf', name: 'perf:     🚀 Performance improvements' },
    { value: 'test', name: 'test:     🧪 Adding or modifying tests' },
    { value: 'build', name: 'build:    🏗️ Build system changes' },
    { value: 'ci', name: 'ci:       🤖 CI configuration changes' },
    { value: 'chore', name: 'chore:    🔧 Maintenance tasks' },
    { value: 'revert', name: 'revert:   ⏪ Revert a previous commit' },
  ],

  scopes: [{ name: 'core' }, { name: 'ui' }, { name: 'deps' }, { name: 'config' }, { name: 'docs' }],

  // Specify custom scopes based on your project
  scopeOverrides: {
    fix: [{ name: 'merge' }, { name: 'style' }, { name: 'test' }, { name: 'hotfix' }],
  },

  // Customize messages
  messages: {
    type: 'Select the type of change you are committing:',
    scope: 'Specify a scope (optional):',
    // Provide a default scope
    customScope: 'Enter a custom scope:',
    subject: 'Write a short, imperative mood description of the change:\n',
    body: 'Provide a longer description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'References (optional). E.g.: PROJ-123, PROJ-456:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit?',
  },

  // Allow breaking changes
  allowBreakingChanges: ['feat', 'fix'],

  // Limit subject length
  subjectLimit: 100,

  // Custom validation
  validateCommitMessage: commitMessage => {
    const jiraTicketRegex =
      /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9\-_]+\))?: [A-Z].*$/;
    return jiraTicketRegex.test(commitMessage);
  },
};
