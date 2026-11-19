// Points the auto-updater at THIS GitHub repository (runs inside GitHub Actions).
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
if (owner && repo) {
  p.build.publish = [{ provider: 'github', owner, repo, releaseType: 'release' }];
  fs.writeFileSync('package.json', JSON.stringify(p, null, 2));
  console.log('Publish target set to', owner + '/' + repo);
}
