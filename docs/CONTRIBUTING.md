# Contributing

## Conventions

### Conventional Branch

We are using slightly flavored ruleset from ```Conventional Branch 1.0.0```, you can find a copy of original ruleset [here](./conventional-branch.md)

In our implementation key changes is issue number, which is required in branch name.

We are currently not using release branches and chore branches to not enlarge complexity of rules.

#### Conventional Branch - Summary

Conventional Branch refers to a structured and standardized naming convention for Git branches which aims to make branch more readable and actionable. We've suggested some branch prefixes you might want to use but you can also specify your own naming convention. A consistent naming convention makes it easier to identify branches by type.

##### Conventional Branch - Summary - Key Points

1. **Purpose-driven Branch Names**: Each branch name clearly indicates its purpose, making it easy for all developers to understand what the branch is for.
2. **Integration with CI/CD**: By using consistent branch names, it can help automated systems (like Continuous Integration/Continuous Deployment pipelines) to trigger specific actions based on the branch type (e.g., auto-deployment from release branches).
3. **Team Collaboration** : It encourages collaboration within teams by making branch purpose explicit, reducing misunderstandings and making it easier for team members to switch between tasks without confusion.

#### Conventional Branch - Specification

#### Conventional Branch - Specification - Branch Naming Prefixes

The branch specification by describing with `feature/`, `bugfix/`, `hotfix/` and issue number  and it should be structured as follows:

---

```
<type>/<issue number>/<description>
```

**Type**:

- **`main`**: The main development branch (e.g., `main`, `master`, or `develop`)
- **`feature/`**: For new features (e.g., `feature/issue-1/add-login-page`)
- **`bugfix/`**: For bug fixes (e.g., `bugfix/issue-1-fix/header-bug`)
- **`hotfix/`**: For urgent fixes (e.g., `hotfix/issue-1/security-patch`)

**Issue number**:

- **`issue-1`**: addition for issue number

---

#### Conventional Branch - Specification - Basic Rules

1. **Use Lowercase Alphanumerics, Hyphens**: Always use lowercase letters (`a-z`), numbers (`0-9`), and hyphens(`-`) to separate words. Avoid special characters, underscores, or spaces.
2. **No Consecutive, Leading, or Trailing Hyphens**: Ensure that hyphens do not appear consecutively (e.g., `feature/issue-1/new--login`), nor at the start or end of the description (e.g., `feature/issue-1/-new-login`).
3. **Keep It Clear and Concise**: The branch name should be descriptive yet concise, clearly indicating the purpose of the work.
4. **Include Issue Numbers**: Include the issue number from github issue. For example, for a `issue-123`, the branch name should be `feature/issue-123/new-login`.
5. **No reference branch**: In case of branch does not have issue (for example hotfix to restore basic functions after incident) you can use `no-ref` in its name. Example: hotfix for domain name branch without issue should named: `hotfix/no-ref/correct-domain-name`

#### Conventional Branch - Conclusion

- **Clear Communication**: The branch name alone provides a clear understanding of its purpose the code change.
- **Automation-Friendly**: Easily hooks into automation processes (e.g., different workflows for `feature` etc.).
- **Scalability**: Works well in large teams where many developers are working on different tasks simultaneously.

In summary, conventional branch is designed to improve project organization, communication, and automation within Git workflows.

### Conventional Commits

We are using slightly flavored ruleset from ```Conventional Commits 1.0.0```, you can find a copy of original ruleset [here](./conventional-commits.md)

#### Conventional Commits - Type

The commit contains the following structural elements, to communicate intent to the consumers of your library:

1. **fix:** a commit of the _type_ `fix` patches a bug in your codebase (this correlates with [`PATCH`](http://semver.org/#summary) in Semantic Versioning).
2. **feat:** a commit of the _type_ `feat` introduces a new feature to the codebase (this correlates with [`MINOR`](http://semver.org/#summary) in Semantic Versioning).
3. **refactor** a commit fo the _type_ `refactor` changes the codebase to improve the code readability or minor performance issues
4. **ci** a commit of _type_ `ci` changes CI/CD pipelines or integration
5. **docs** a commit of  _type_ `docs` changes the documentation for the project excluding changes in actual code
6. **test** a commit of _type_ `test` changes the test cases or test related code
7. **chore** a commit of  _type_ `chore` represents any other changes like linting code, moving files

After the type, should be a ":" separating commit description.

#### Conventional Commits - Description

A description MUST immediately follow the colon and space after the type/scope prefix.

The description is a short summary of the code changes, e.g., _fix: correct array parsing issue when multiple spaces were contained in string_. It should start with a verb and contain statements in an imperative form. Description could contain multiple statements, each should be separated with ";"

A longer commit body MAY be provided after the short description, providing additional contextual information about the code changes. The body MUST begin one blank line after the description.

#### Conventional Commits - Issue reference

If commit associated with issue form github of the project in the end of the commit message reference to this issue should be present: (#32)

#### Conventional Commits - Template

```
<type>: <description> <reference>
```

Where:

- **type**: one of the following: fix, feat, refactor, ci, docs, test, chore
- **description**: statement describing commit in imperative form separated with semicolon
- **reference**: reference to the issue number in the form of (#32)

Examples:

- ```fix: correct authorization form (#12)```
- ```feat: add new schema formatter (#13)```
- ```refactor: update sorting algorithm of nodes (#14)```
- ```ci: add pipeline for docker build (#15)```
- ```docs: update README.md (#16)```
- ```test: add test issue template (#17)```
- ```chore: format and lint code (#18)```
