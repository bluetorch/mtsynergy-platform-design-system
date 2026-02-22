/**
 * Build script orchestrator for design tokens
 * Generates Tailwind config and token JSON from TypeScript token definitions
 */

import { generateAll } from './generate-tailwind-config';

async function buildTokens() {
  console.log('🔨 Building design tokens...\n');

  try {
    generateAll();
    console.log('\n✅ Token build successful');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Token build failed:', error);
    process.exit(1);
  }
}

// Call immediately instead of in conditional
buildTokens();
