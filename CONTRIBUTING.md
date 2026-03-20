# Contributing

When contributing to this repository, please:

1. Discuss the change via an issue first, to avoid unnecessary work
2. Follow the development process outlined below
3. Follow our Code of Conduct

## Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Check code formatting
npm run prettier:check

# Format and fix code
npm run prettier:write

# Run linter
npm run lint

# Build TypeScript
npm run build

# Generate documentation
npm run docs
```

## Code Style

This project uses:

- **Prettier** for code formatting (configured in `.prettierrc.js`)
- **ESLint** for linting (configured in `.eslintrc.js`)
- **TypeScript** with strict mode enabled
- **Husky** pre-commit hooks to enforce quality standards

Code must be:

- Properly formatted with Prettier
- Free of linting errors
- Fully typed with TypeScript
- Covered by tests (aim for >90% coverage)

## Pull Request Process

1. Ensure your local branch is up to date with `master`
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and write/update tests
4. Run the full test suite and ensure all tests pass:
   ```bash
   npm test
   npm run lint
   npm run prettier:check
   npm run build
   ```
5. Commit with clear, descriptive messages following conventional commits:
   - `feat: add new feature`
   - `fix: resolve bug`
   - `test: add tests`
   - `docs: update documentation`
   - `chore: maintenance tasks`
   - `refactor: code restructuring`
6. Push to your fork and create a Pull Request
7. Update the README.md with details of interface changes, new environment variables, ports, or file locations
8. Update the CHANGELOG.md with a summary of changes
9. Ensure the PR passes all automated checks (CI/CD)
10. A repository maintainer will review and merge with sign-off

## Testing

All new features and bug fixes must include:

- Unit tests covering the new functionality
- Tests for edge cases and error conditions
- Integration tests when interacting with multiple components

Run tests with:

```bash
npm test                      # Run all tests
npm test -- --coverage       # Run with coverage report
npm test -- --watch          # Watch mode for development
```

## Commit Messages

Use conventional commits for clear, semantic commit messages:

- Start with type: `feat:`, `fix:`, `test:`, `docs:`, `chore:`, etc.
- Use present tense ("add feature" not "added feature")
- Keep messages concise (first line < 50 chars)
- Provide detailed explanation in body if needed

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing opinions, viewpoints, and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

For more details see our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team [here](mailto:oss@reactivelions.com?subject=react-native-uuid). All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
