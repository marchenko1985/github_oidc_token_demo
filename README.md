# GitHub OIDC Token Demo

In Github Actions we can ask Github to sign token that is OIDC compliant and can be verified on our side

Which allows us to make secure calls from Github Actions to our services

This repo holds some notes and examples of how it looks like

(token.yml)[.github/workflows/token.yml] workflow whos how token can be acquired

```json
{
  "actor": "marchenko1985",
  "actor_id": "88868",
  "aud": "demo",
  "base_ref": "",
  "check_run_id": "72463523102",
  "event_name": "workflow_dispatch",
  "exp": 1776844793,
  "head_ref": "",
  "iat": 1776844493,
  "iss": "https://token.actions.githubusercontent.com",
  "job_workflow_ref": "marchenko1985/github_oidc_token_demo/.github/workflows/token.yml@refs/heads/main",
  "job_workflow_sha": "a6c5fce977dda2c7d53a29c1ef1744c31bf6d1b4",
  "jti": "316ef8dc-d439-4990-862e-ae5037fe29d0",
  "nbf": 1776844193,
  "ref": "refs/heads/main",
  "ref_protected": "false",
  "ref_type": "branch",
  "repository": "marchenko1985/github_oidc_token_demo",
  "repository_id": "1217768983",
  "repository_owner": "marchenko1985",
  "repository_owner_id": "88868",
  "repository_visibility": "public",
  "run_attempt": "1",
  "run_id": "24766983965",
  "run_number": "3",
  "runner_environment": "github-hosted",
  "sha": "a6c5fce977dda2c7d53a29c1ef1744c31bf6d1b4",
  "sub": "repo:marchenko1985/github_oidc_token_demo:ref:refs/heads/main",
  "workflow": "token",
  "workflow_ref": "marchenko1985/github_oidc_token_demo/.github/workflows/token.yml@refs/heads/main",
  "workflow_sha": "a6c5fce977dda2c7d53a29c1ef1744c31bf6d1b4"
}
```
