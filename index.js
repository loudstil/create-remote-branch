const core = require('@actions/core');
const github = require('@actions/github');

const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const branchName =  core.getInput('branch-name');

    const commitSHA = getLatestCommitSha(owner, repo);
    createNewBranchIfNotExists(owner, repo, branchName, commitSHA);
    
} catch (error) {
  core.setFailed(error.message);
}

async function getLatestCommitSha(owner, repo) {
    const { data: commit } = await octokit.rest.repos.getCommit({
      owner: owner,
      repo: repo,
      ref: `refs/heads/main`
    });
  
    return commit.data.sha;
  }

async function createNewBranchIfNotExists(owner, repo, branchName, commitSHA){
    try {
        // Check if the branch already exists
        await github.git.getRef({
          owner: owner,
          repo: repo,
          ref: `heads/${branch}`
        });
        
        console.log(`Branch "${branchName}" already exists.`);
        
      } catch (error) {
        // If the branch doesn't exist, create it
        if (error.status === 404) {
          await github.git.createRef({
            owner: owner,
            repo: repo,
            ref: `refs/heads/${branchName}`,
            sha: commitSHA
          });
          console.log(`Branch "${branchName}" created successfully.`);
        } else {
          // Handle other errors
          throw new Error(error.message);
        }
      }
}