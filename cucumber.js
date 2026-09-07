
const common = {
  requireModule: ['ts-node/register'], 
  require: [
    'src/world/CustomWorld.ts', 
    'src/stepDefinitions/**/*.ts', 
  ],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'allure-cucumberjs/reporter',
  ],
  formatOptions: {
    resultsDir: 'allure-results',
  },
  paths: ['features/**/*.feature'], 
  timeout: 20000, 
  parallel: 4,
  retry: 1,
};

module.exports = {
  default: common,
};
