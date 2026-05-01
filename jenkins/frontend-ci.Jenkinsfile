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
                sh """
                    docker run --rm \
                      -v "$WORKSPACE:/workspace" \
                      -w /workspace/${env.FRONTEND_DIR} \
                      ${env.NODE_TEST_IMAGE} \
                      bash -lc "npm install"
                """
            }
        }

        stage('Unit Tests') {
            steps {
                sh """
                    docker run --rm \
                      -v "$WORKSPACE:/workspace" \
                      -w /workspace/${env.FRONTEND_DIR} \
                      ${env.NODE_TEST_IMAGE} \
                      bash -lc "npm run test -- --watch=false"
                """
            }
        }

        stage('Production Build') {
            steps {
                sh """
                    docker run --rm \
                      -v "$WORKSPACE:/workspace" \
                      -w /workspace/${env.FRONTEND_DIR} \
                      ${env.NODE_TEST_IMAGE} \
                      bash -lc "npm run build"
                """
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
