# Jenkins Jobs

This folder contains the Jenkins pipeline definitions for Learnivo services.

## Frontend jobs

Create these two Jenkins Pipeline jobs:

1. `frontend-ci`
2. `frontend-cd`

Use these pipeline script paths:

- `jenkins/frontend-ci.Jenkinsfile`
- `jenkins/frontend-cd.Jenkinsfile`

## Recommended job setup

For both jobs in Jenkins:

1. Create a new item.
2. Choose `Pipeline`.
3. Set the job name:
   - `frontend-ci` for the CI pipeline
   - `frontend-cd` for the deployment pipeline
4. In `Pipeline`, choose `Pipeline script from SCM`.
5. Select `Git`.
6. Add your repository URL and credentials if needed.
7. Choose the branch you want Jenkins to build, for example `*/main`.
8. Set `Script Path`:
   - `jenkins/frontend-ci.Jenkinsfile` for the CI job
   - `jenkins/frontend-cd.Jenkinsfile` for the CD job
9. Save the job.

## What the jobs do

`frontend-ci`:
- checks out a clean workspace
- installs frontend dependencies inside Docker
- runs Angular unit tests
- builds the production frontend
- archives the build output
- triggers `frontend-cd` with the exact tested commit SHA

`frontend-cd`:
- checks out a clean workspace
- checks out the exact commit received from CI
- builds the frontend Docker image
- deploys the container on port `4200`
- verifies Nginx is responding inside the container

## Requirements

Your Jenkins agent needs:

- Docker available in the agent environment
- access to the repository
- permission to run `docker build`, `docker run`, and `docker exec`

If you use the provided `docker-compose.jenkins.yml`, Jenkins runs with the Docker socket mounted so these pipeline files can execute Docker commands.
