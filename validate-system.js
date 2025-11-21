#!/usr/bin/env node

/**
 * System Validation Script
 * Checks that all refactored components are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AI Career Coach - System Validation\n');
console.log('=' .repeat(50));

// Check required files exist
const requiredFiles = [
  'lib/config.ts',
  'lib/logger.ts',
  'lib/rate-limiter.ts',
  'lib/ai-service.ts',
  'lib/auth-jwt.ts',
  'lib/db.ts',
  'app/api/coach/route.ts',
  'app/api/auth/login/route.ts',
  'app/api/auth/signup/route.ts',
  'middleware.ts',
  '.env.local.example',
];

console.log('\n📁 Checking File Structure...');
let fileErrors = 0;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) fileErrors++;
});

// Check .env.local exists
console.log('\n⚙️  Checking Environment Configuration...');
const envExists = fs.existsSync(path.join(__dirname, '.env.local'));
console.log(`  ${envExists ? '✅' : '⚠️ '} .env.local ${envExists ? 'exists' : '(create from .env.local.example)'}`);

// Load and check environment variables
if (envExists) {
  require('dotenv').config({ path: '.env.local' });
  
  const requiredEnvVars = [
    'GEMINI_API_KEY',
    'JWT_SECRET',
    'DATABASE_URL',
  ];
  
  const optionalEnvVars = [
    'OPENAI_API_KEY',
    'AI_TIMEOUT_MS',
    'RATE_LIMIT_MAX_REQUESTS',
    'LOG_LEVEL',
  ];
  
  console.log('\n  Required variables:');
  requiredEnvVars.forEach(varName => {
    const exists = !!process.env[varName];
    const isPlaceholder = process.env[varName]?.includes('your-') || 
                         process.env[varName]?.includes('USER:PASSWORD');
    console.log(`    ${exists && !isPlaceholder ? '✅' : '❌'} ${varName} ${
      !exists ? '(missing)' : isPlaceholder ? '(placeholder - update value)' : ''
    }`);
  });
  
  console.log('\n  Optional variables:');
  optionalEnvVars.forEach(varName => {
    const exists = !!process.env[varName];
    console.log(`    ${exists ? '✅' : '⚪'} ${varName}`);
  });
}

// Check Node modules
console.log('\n📦 Checking Dependencies...');
const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
console.log(`  ${nodeModulesExists ? '✅' : '❌'} node_modules installed`);

// Check Prisma client
const prismaClientExists = fs.existsSync(
  path.join(__dirname, 'lib/generated/prisma/client')
);
console.log(`  ${prismaClientExists ? '✅' : '⚠️ '} Prisma client ${prismaClientExists ? 'generated' : '(run: npm run prisma:generate)'}`);

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Validation Summary:');
console.log(`  File Structure: ${fileErrors === 0 ? '✅ PASS' : `❌ FAIL (${fileErrors} missing)`}`);
console.log(`  Environment: ${envExists ? '✅ CONFIGURED' : '⚠️  NEEDS SETUP'}`);
console.log(`  Dependencies: ${nodeModulesExists ? '✅ INSTALLED' : '❌ MISSING'}`);
console.log(`  Database: ${prismaClientExists ? '✅ READY' : '⚠️  NEEDS GENERATION'}`);

console.log('\n🚀 Next Steps:');
if (!envExists) {
  console.log('  1. Copy .env.local.example to .env.local');
  console.log('  2. Fill in GEMINI_API_KEY, JWT_SECRET, DATABASE_URL');
}
if (!nodeModulesExists) {
  console.log('  1. Run: npm install');
}
if (!prismaClientExists) {
  console.log('  1. Run: npm run prisma:generate');
}
if (envExists && nodeModulesExists && prismaClientExists) {
  console.log('  ✅ System ready! Run: npm run dev');
}

console.log('\n📚 Documentation:');
console.log('  - REFACTORING_COMPLETE.md - Full refactoring details');
console.log('  - .env.local.example - Configuration guide');
console.log('  - README.md - Project overview');

console.log('\n' + '='.repeat(50));
