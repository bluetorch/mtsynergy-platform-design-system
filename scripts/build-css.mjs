#!/usr/bin/env node

/**
 * Build script for compiling prefixed DS CSS
 * Generates dist/styles.css with mts- prefixed utilities
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

try {
  console.log('🔨 Compiling prefixed CSS...');

  // Ensure dist directory exists
  const distDir = path.join(projectRoot, 'dist');
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }

  // Use NODE_OPTIONS to load TypeScript files with tsx using --import
  const command = [
    'NODE_OPTIONS="--import tsx" npx tailwindcss',
    `-c ${path.join(projectRoot, 'tailwind.mts.config.js')}`,
    `-i ${path.join(projectRoot, 'src', 'styles', 'mts.css')}`,
    `-o ${path.join(projectRoot, 'dist', 'styles.css')}`,
    '--minify',
  ].join(' ');

  execSync(command, { stdio: 'inherit', cwd: projectRoot, shell: true });

  // Smoke test: Verify critical tokens are present
  const output = readFileSync(path.join(distDir, 'styles.css'), 'utf-8');
  if (!output.includes('mts-bg-primary-500')) {
    throw new Error('Generated CSS missing design tokens! .mts-bg-primary-500 not found.');
  }

  console.log('✓ Compiled dist/styles.css');
} catch (error) {
  console.error('Error compiling CSS:', error);
  process.exit(1);
}
