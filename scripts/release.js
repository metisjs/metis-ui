require('zx/globals');
const { logger } = require('@umijs/utils');
const getGitRepoInfo = require('git-repo-info');
const { join } = require('path');
const rimraf = require('rimraf');

function assert(v, message) {
  if (!v) {
    logger.error(message);
    process.exit(1);
  }
}

(async () => {
  const { branch } = getGitRepoInfo();
  logger.info(`branch: ${branch}`);

  // check git status
  logger.event('check git status');
  const isGitClean = (await $`git status --porcelain`).stdout.trim().length;
  assert(!isGitClean, 'git status is not clean');

  // check git remote update
  logger.event('check git remote update');
  await $`git fetch`;
  const gitStatus = (await $`git status --short --branch`).stdout.trim();
  assert(!gitStatus.includes('behind'), `git status is behind remote`);

  // check npm registry
  logger.event('check npm registry');
  const registry = (await $`npm config get registry`).stdout.trim();
  assert(
    registry === 'https://registry.npmjs.org/',
    'npm registry is not https://registry.npmjs.org/',
  );

  // clean
  logger.event('clean dist');
  rimraf.sync(join(__dirname, '../dist'));
  logger.event('clean es');
  rimraf.sync(join(__dirname, '../es'));
  logger.event('clean lib');
  rimraf.sync(join(__dirname, '../lib'));

  // build packages
  logger.event('build package');
  await $`npm run build`;

  // bump version
  // logger.event('bump version');
  const version = require(join(__dirname, '../package.json')).version;
  let tag = 'latest';
  if (version.includes('-alpha.') || version.includes('-beta.') || version.includes('-rc.')) {
    tag = 'next';
  }
  if (version.includes('-canary.')) tag = 'canary';

  // git tag
  if (tag !== 'canary') {
    logger.event('git tag');
    await $`git tag ${version}`;
  }

  // // git push
  logger.event('git push');
  await $`git push origin ${branch} --tags`;

  // pnpm publish
  logger.event('pnpm publish');
  $.verbose = false;

  // check 2fa config
  let otpArg = [];
  if ((await $`npm profile get "two-factor auth"`).toString().includes('writes')) {
    let code = '';
    do {
      // get otp from user
      code = await question('This operation requires a one-time password: ');
      // generate arg for zx command
      // why use array? https://github.com/google/zx/blob/main/docs/quotes.md
      otpArg = ['--otp', code];
    } while (code.length !== 6);
  }

  await $`pnpm publish --no-git-checks --tag ${tag} ${otpArg}`;
  logger.info(`+ metis-ui`);
  $.verbose = true;
})();
