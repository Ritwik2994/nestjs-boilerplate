const fs = require('fs');
const path = require('path');

// Custom commit types with Jira-style descriptions
const commitTypes = {
  feature: {
    description: 'A new feature for the user',
    title: 'Features',
  },
  fix: {
    description: 'A bug fix',
    title: 'Bug Fixes',
  },
  docs: {
    description: 'Documentation only changes',
    title: 'Documentation',
  },
  style: {
    description: 'Changes that do not affect the meaning of the code',
    title: 'Style Changes',
  },
  refactor: {
    description: 'A code change that neither fixes a bug nor adds a feature',
    title: 'Code Refactoring',
  },
  perf: {
    description: 'A code change that improves performance',
    title: 'Performance Improvements',
  },
  test: {
    description: 'Adding missing tests or correcting existing tests',
    title: 'Tests',
  },
  build: {
    description: 'Changes that affect the build system or external dependencies',
    title: 'Build System',
  },
  ci: {
    description: 'Changes to your CI configuration files and scripts',
    title: 'Continuous Integration',
  },
  chore: {
    description: "Other changes that don't modify src or test files",
    title: 'Chores',
  },
  revert: {
    description: 'Reverts a previous commit',
    title: 'Reverts',
  },
};

// Custom Commitizen prompt
module.exports = {
  types: commitTypes,

  // Jira ticket pattern validation
  validateTicketNumber: ticketNumber => {
    const jiraTicketRegex = /^[A-Z]+-\d+$/;
    return jiraTicketRegex.test(ticketNumber);
  },

  // Custom prompt
  prompter: (cz, commit) => {
    cz.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select the type of change you are committing:',
        choices: Object.keys(commitTypes).map(type => ({
          name: `${type}: ${commitTypes[type].description}`,
          value: type,
        })),
      },
      {
        type: 'input',
        name: 'ticket',
        message: 'Enter Jira ticket number (e.g., PROJ-123):',
        validate: input => {
          if (!input) {
            return 'Ticket number is required';
          }
          if (!module.exports.validateTicketNumber(input)) {
            return 'Invalid ticket number format. Use format like PROJ-123';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'subject',
        message: 'Write a short, imperative mood description of the change:',
        validate: input => {
          if (!input.trim()) {
            return 'Subject is required';
          }
          if (input.length > 72) {
            return 'Subject must be less than 72 characters';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'body',
        message: 'Provide a longer description of the change (optional):',
        default: '',
      },
      {
        type: 'confirm',
        name: 'breaking',
        message: 'Are there any breaking changes?',
        default: false,
      },
    ]).then(answers => {
      // Construct the commit message
      const commitMessage = [
        `${answers.type}(${answers.ticket}): ${answers.subject}`,
        answers.body ? `\n${answers.body}` : '',
        answers.breaking ? '\nBREAKING CHANGE: Describe the breaking change' : '',
      ]
        .join('')
        .trim();

      // Commit with the formatted message
      commit(commitMessage);
    });
  },
};
