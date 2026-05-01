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
        SERVICE_NAME = 'quiz-service'
        POM_PATH = 'backend/pom.xml'
        IMAGE_NAME = 'learnivo/quiz-service'
        CONTAINER_NAME = 'learnivo-quiz-service'
        HOST_PORT = '8082'
        CONTAINER_PORT = '8082'
        MAVEN_IMAGE = 'maven:3.9.11-eclipse-temurin-17'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.image(env.MAVEN_IMAGE).inside('-v /var/run/docker.sock:/var/run/docker.sock -v jenkins-m2-cache:/root/.m2') {
                        sh """
                            mvn -f ${env.POM_PATH} -pl ${env.SERVICE_NAME} -am -DskipTests \
                              spring-boot:build-image \
                              -Dspring-boot.build-image.imageName=${env.IMAGE_NAME}:${env.BUILD_NUMBER}
                        """
                    }
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker rm -f ${env.CONTAINER_NAME} || true
                    docker run -d \
                      --name ${env.CONTAINER_NAME} \
                      -p ${env.HOST_PORT}:${env.CONTAINER_PORT} \
                      -e SPRING_PROFILES_ACTIVE=local \
                      -e EUREKA_CLIENT_ENABLED=false \
                      -e APP_SECURITY_ENABLED=false \
                      ${env.IMAGE_NAME}:${env.BUILD_NUMBER}
                """
            }
        }

        stage('Smoke Test') {
            steps {
                sh """
                    for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
                      if curl -fsS http://localhost:${env.HOST_PORT}/v3/api-docs > /dev/null; then
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
