pipeline {
    agent any

    // Requires: Jenkins "NodeJS" plugin, with a tool named "Node22" configured
    // under Manage Jenkins -> Tools -> NodeJS installations.
    tools {
        nodejs 'Node22'
    }

    parameters {
        choice(name: 'BROWSER', choices: ['chrome', 'firefox', 'webkit'], description: 'Browser to run against')
        // Each choice maps 1:1 to an existing "test:<suite>" script in package.json
        // (which itself runs runner.ts <suite> -- see runner.ts for the tag mapping).
        choice(
            name: 'SUITE',
            choices: ['smoke', 'sanity', 'regression', 'positive', 'negative', 'all'],
            description: 'Which tagged suite to run'
        )
    }

    environment {
        // These override .env — dotenv never overwrites a variable that
        // already exists in process.env, so whatever is set here wins.
        EXECUTION_ENV = 'local'
        BROWSER       = "${params.BROWSER}"
        HEADLESS      = 'true'   // CI agents have no display — always headless
        APP_URL       = 'https://www.saucedemo.com/'
        SLOW_MO       = '0'      // no artificial delay needed on CI
        HOLD_MS       = '0'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint & format check') {
            steps {
                // Fails fast before spending time installing browsers --
                // enforces the eslint/prettier setup instead of leaving it
                // as tooling nobody's build actually checks.
                sh 'npm run lint'
                sh 'npm run format:check'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                sh 'npx playwright install --with-deps chromium firefox webkit'
            }
        }

        stage('Run tests') {
            steps {
                // Don't let a test failure short-circuit the pipeline before
                // reports get published — capture the exit code instead.
                // SUITE picks which package.json "test:<suite>" script runs --
                // e.g. selecting "smoke" here runs "npm run test:smoke".
                script {
                    env.TEST_EXIT_CODE = sh(script: "npm run test:${params.SUITE}", returnStatus: true).toString()
                }
            }
        }

        stage('Generate Allure report') {
            steps {
                sh 'npm run allure:generate'
            }
        }
    }

    post {
        always {
            // Built-in Cucumber HTML/JSON report
            publishHTML(target: [
                reportName : 'Cucumber Report',
                reportDir  : 'reports',
                reportFiles: 'cucumber-report.html',
                keepAll    : true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])

            // Requires the "Allure Jenkins Plugin"
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]

            archiveArtifacts artifacts: 'screenshots/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true

            script {
                if (env.TEST_EXIT_CODE != '0') {
                    currentBuild.result = 'FAILURE'
                    error("Cucumber tests failed with exit code ${env.TEST_EXIT_CODE}")
                }
            }
        }
    }
}
