def runFrontendCommandInContainer(String command, List<String> copyBackPaths = []) {
    def escapedCommand = command.replace("'", "'\"'\"'")
    def copyBackScript = copyBackPaths.collect { path ->
        """
            docker cp "\$cid:/workspace/${env.FRONTEND_DIR}/${path}" "$WORKSPACE/${env.FRONTEND_DIR}/" >/dev/null 2>&1 || true
        """.stripIndent().trim()
    }.join('\n')

    sh """
        set -eu
        cid=\$(docker create \\
          --workdir /workspace/${env.FRONTEND_DIR} \\
          ${env.NODE_TEST_IMAGE} \\
          bash -lc '${escapedCommand}')
        cleanup() {
            docker rm -f "\$cid" >/dev/null 2>&1 || true
        }
        trap cleanup EXIT

        # The Jenkins workspace lives inside the Jenkins container, so copy it into
        # the test container instead of bind-mounting a host path that Docker cannot see.
        docker cp "$WORKSPACE/." "\$cid:/workspace"
        docker start -a "\$cid"
        ${copyBackScript}
    """
}

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        FRONTEND_DIR = 'frontend'
        NODE_TEST_IMAGE = 'mcr.microsoft.com/playwright:v1.52.0-noble'
    }

    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    runFrontendCommandInContainer('npm install', ['node_modules', 'package-lock.json'])
                }
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    runFrontendCommandInContainer('npm run test:ci', ['coverage'])
                }
            }
        }

        stage('Production Build') {
            steps {
                script {
                    runFrontendCommandInContainer('npm run build', ['dist'])
                }
            }
        }

        stage('Archive Frontend Build') {
            steps {
                archiveArtifacts artifacts: 'frontend/dist/**/*', fingerprint: true
            }
        }
    }

    post {
        success {
            build job: 'frontend-cd',
                wait: false,
                parameters: [
                    string(name: 'UPSTREAM_BUILD', value: env.BUILD_NUMBER),
                    string(name: 'GIT_COMMIT_SHA', value: env.GIT_COMMIT)
                ]
        }
    }
}
