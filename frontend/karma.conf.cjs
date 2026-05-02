const fs = require('node:fs');

const chromeCandidates = [
  process.env.CHROME_BIN,
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);

if (!process.env.CHROME_BIN) {
  const playwrightBrowserRoot = '/ms-playwright';
  if (fs.existsSync(playwrightBrowserRoot)) {
    const chromiumFolder = fs
      .readdirSync(playwrightBrowserRoot, { withFileTypes: true })
      .find((entry) => entry.isDirectory() && entry.name.startsWith('chromium-'));

    if (chromiumFolder) {
      chromeCandidates.unshift(`${playwrightBrowserRoot}/${chromiumFolder.name}/chrome-linux/chrome`);
    }
  }

  const detectedChrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
  if (detectedChrome) {
    process.env.CHROME_BIN = detectedChrome;
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],
    client: {
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('node:path').join(__dirname, 'coverage/frontend-v21'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly', file: 'lcov.info' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
      }
    },
    restartOnFileChange: true
  });
};
