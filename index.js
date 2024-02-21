const core = require('@actions/core');
const github = require('@actions/github');

// Create Octokit instance outside functions
const octokit = github.getOctokit(core.getInput('token'));

try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const branchName = core.getInput('branch-name');

    getLatestCommitSha(owner, repo)
        .then(commitSHA => createNewBranchIfNotExists(owner, repo, branchName, commitSHA))
        .catch(error => core.setFailed(error.message));
} catch (error) {
    core.setFailed(error.message);
}

async function getLatestCommitSha(owner, repo) {
    const commit = await octokit.rest.repos.getCommit({
        owner: owner,
        repo: repo,
        ref: `refs/heads/main`
    });

    return commit.data.sha;
}

async function createNewBranchIfNotExists(owner, repo, branchName, commitSHA) {
    console.log(owner, repo, branchName, commitSHA);

    try {
        // Check if the branch already exists
        await octokit.rest.git.getRef({
            owner: owner,
            repo: repo,
            ref: `refs/heads/${branchName}`
        });

        console.log(`Branch "${branchName}" already exists.`);

    } catch (error) {
        // If the branch doesn't exist, create it
        if (error.status === 404) {
            console.log(`Creating Branch "${branchName}".`);
            await octokit.rest.git.createRef({
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
