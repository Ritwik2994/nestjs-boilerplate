#!/bin/bash

# Install Commitizen and related tools
npm install -D \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional \
  commitizen \
  cz-custom \
  @types/jest

# Initialize Husky
npx husky install

# Create commit-msg hook for commitlint
npx husky add .husky/commit-msg 'npx commitlint --edit "$1"'

# Create pre-commit hook for lint-staged
npx husky add .husky/pre-commit 'npx lint-staged'

# Configure Commitizen
npm pkg set config.commitizen.path="cz-custom"

# Add npm scripts for easier commit workflow
npm pkg set scripts.commit="cz"
npm pkg set scripts.prepare="husky install"

# Create .czrc for global Commitizen configuration
echo '{ "path": "cz-custom" }' > .czrc

echo "Commitizen with Jira integration setup complete! 🚀"