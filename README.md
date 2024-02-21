# Create New Remote Branch

Creating new branch is a remote repository (in the same org)

## Inputs

### `owner`

**Required** The Owner of the remote branch

### `branch-name`

**Required** The name of the new branch

### `repo`

**Reuired** The name of therepository

### `token`

**Reuired** GitHub token

## Example usage

```yaml
uses: actions/create-remote-branch@e76147da8e5c81eaf017dede5645551d4b94427b
with:
  owner: 'loudstil'
  branch-name: 'newbranch'
  repo: 'test'
  token: ${{ secrets.GITHUB_TOKEN }}
```
