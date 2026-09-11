const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[Build] Starting SevaConnect production build...');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.resolve(rootDir, 'frontend');
const frontendDist = path.resolve(frontendDir, 'dist');
const rootDist = path.resolve(rootDir, 'dist');

// 1. Install frontend dependencies if needed and build Vite app
console.log('[Build] Building frontend with Vite...');
execSync('npm --prefix frontend install --include=dev', { stdio: 'inherit', cwd: rootDir });
execSync('npm --prefix frontend run build', { stdio: 'inherit', cwd: rootDir });

// 2. Ensure 404.html fallback exists in frontend/dist
const frontendIndex = path.resolve(frontendDist, 'index.html');
const frontend404 = path.resolve(frontendDist, '404.html');
if (fs.existsSync(frontendIndex)) {
  fs.copyFileSync(frontendIndex, frontend404);
  console.log('[Build] Created frontend/dist/404.html SPA fallback');
}

// 3. Copy frontend/dist to root dist folder for universal Vercel compatibility
console.log('[Build] Syncing build output to root dist directory...');
if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}
fs.cpSync(frontendDist, rootDist, { recursive: true });

// 4. Ensure root dist has 404.html as well
const rootIndex = path.resolve(rootDist, 'index.html');
const root404 = path.resolve(rootDist, '404.html');
if (fs.existsSync(rootIndex)) {
  fs.copyFileSync(rootIndex, root404);
}

console.log('[Build] Production build completed successfully! Both dist/ and frontend/dist/ are ready.');
