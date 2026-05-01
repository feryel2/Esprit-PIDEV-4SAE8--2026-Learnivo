pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        SERVICE_NAME = 'quiz-service'
        MODULE_PATH = 'backend/quiz-service'
        POM_PATH = 'backend/pom.xml'
        MAVEN_IMAGE = 'maven:3.9.11-eclipse-temurin-17'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    docker.image(env.MAVEN_IMAGE).inside('-v jenkins-m2-cache:/root/.m2') {
                        sh "mvn -f ${env.POM_PATH} -pl ${env.SERVICE_NAME} -am test"
                    }
                }
            }
        }

        stage('Package Jar') {
            steps {
                script {
                    docker.image(env.MAVEN_IMAGE).inside('-v jenkins-m2-cache:/root/.m2') {
                        sh "mvn -f ${env.POM_PATH} -pl ${env.SERVICE_NAME} -am -DskipTests package"
                    }
                }
            }
        }

        stage('Archive Test Reports') {
            steps {
                junit allowEmptyResults: false, testResults: 'backend/quiz-service/target/surefire-reports/*.xml'
                archiveArtifacts artifacts: 'backend/quiz-service/target/*.jar', fingerprint: true
            }
        }
    }

    post {
        success {
            build job: 'quiz-service-cd',
                wait: false,
                parameters: [
                    string(name: 'UPSTREAM_BUILD', value: env.BUILD_NUMBER)
                ]
        }
    }
}
