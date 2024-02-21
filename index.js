const core = require('@actions/core');
const github = require('@actions/github');

try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const branchName =  core.getInput('branch-name');
    const token = core.getInput('token');

    const commitSHA = getLatestCommitSha(owner, repo, token);
    createNewBranchIfNotExists(owner, repo, branchName, commitSHA,token);
    
} catch (error) {
  core.setFailed(error.message);
}

async function getLatestCommitSha(owner, repo, token) {
    const octokit = github.getOctokit(token);
    const commit = await octokit.rest.repos.getCommit({
      owner: owner,
      repo: repo,
      ref: `refs/heads/main`
    });
  
    return commit.sha;
  }

async function createNewBranchIfNotExists(owner, repo, branchName, commitSHA, token){
    const octokit = github.getOctokit(token);
    try {
        // Check if the branch already exists
        await octokit.rest.git.getRef({
          owner: owner,
          repo: repo,
          ref: "refs/heads/${branchName}"
        });

        console.log(`Branch "${branchName}" already exists.`);
        
      } catch (error) {
        // If the branch doesn't exist, create it
        if (error.status === 404) {
          console.log(`Creating Branch "${branchName}".`);
          await octokit.rest.git.createRef({
            owner: owner,
            repo: repo,
            ref: "refs/heads/${branchName}",
            sha: commitSHA
          });
          console.log(`Branch "${branchName}" created successfully.`);
        } else {
          // Handle other errors
          throw new Error(error.message);
        }
      }
}
