# Customink Frontend Actions
## pr-description-to-dotenv-action

This action will write environment variables requested in the PR description into a [dotenv](https://github.com/motdotla/dotenv) file for use during the rest of the workflow.

The environment variables must be listed in the pr description in a markdown [fenced code block](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks#fenced-code-blocks) after the words "Environment Variables".

Example:


Envionment Variables
```
TEST_VAR=TEST_VAL
```

### Inputs

### `dotenv-file-name`

**Required** The filename to write the environment variables into. Default to `./.env`.

### Example usage

```
uses: @customink/frontend-gh-actions/pr-desc-to-dotenv-action@v1.0
with:
  dotenv-file-name: '.env.development'
```