pipeline {
    agent any

    tools {
        jdk 'JDK17'
        maven 'Maven3'
    }

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        SERVICE_NAME = 'quiz-service'
        POM_PATH = 'backend/pom.xml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Unit Tests') {
            steps {
                sh "mvn -f ${env.POM_PATH} -pl ${env.SERVICE_NAME} -am test"
            }
        }

        stage('Package Jar') {
            steps {
                sh "mvn -f ${env.POM_PATH} -pl ${env.SERVICE_NAME} -am -DskipTests package"
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "mvn -f ${env.POM_PATH} -pl ${env.SERVICE_NAME} -am sonar:sonar"
                }
            }
        }

        stage('Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: true
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
