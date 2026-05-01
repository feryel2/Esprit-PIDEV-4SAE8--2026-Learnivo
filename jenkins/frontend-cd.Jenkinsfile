pipeline {
    agent any

    parameters {
        string(name: 'UPSTREAM_BUILD', defaultValue: '', description: 'CI build number that triggered this deployment.')
    }

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        IMAGE_NAME = 'learnivo/frontend'
        CONTAINER_NAME = 'learnivo-frontend'
        HOST_PORT = '4200'
        CONTAINER_PORT = '80'
        SMOKE_TEST_URL = 'http://host.docker.internal:4200'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                      -t ${env.IMAGE_NAME}:${env.BUILD_NUMBER} \
                      -f frontend/Dockerfile \
                      frontend
                """
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker rm -f ${env.CONTAINER_NAME} || true
                    docker run -d \
                      --name ${env.CONTAINER_NAME} \
                      -p ${env.HOST_PORT}:${env.CONTAINER_PORT} \
                      ${env.IMAGE_NAME}:${env.BUILD_NUMBER}
                """
            }
        }

        stage('Smoke Test') {
            steps {
                sh """
                    for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
                      if curl -fsS '${env.SMOKE_TEST_URL}' > /dev/null; then
                        exit 0
                      fi
                      sleep 5
                    done
                    docker logs ${env.CONTAINER_NAME} || true
                    exit 1
                """
            }
        }
    }
}
