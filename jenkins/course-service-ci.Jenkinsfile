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
        SERVICE_NAME = 'course-service'
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

        stage('Archive Test Reports') {
            steps {
                junit allowEmptyResults: false, testResults: 'backend/course-service/target/surefire-reports/*.xml'
                archiveArtifacts artifacts: 'backend/course-service/target/*.jar', fingerprint: true
            }
        }
    }

    post {
        success {
            build job: 'course-service-cd',
                wait: false,
                parameters: [
                    string(name: 'UPSTREAM_BUILD', value: env.BUILD_NUMBER)
                ]
        }
    }
}
