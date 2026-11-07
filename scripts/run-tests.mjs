import { execSync } from 'child_process';
import path from 'path';

console.log('Running MindCraft Unit Test Suite...');
const tests = [
  'tests/unit/treeHelpers.test.js',
  'tests/unit/jsonSchema.test.js',
  'tests/unit/markdownParser.test.js',
  'tests/unit/edgeHelpers.test.js',
  'tests/unit/cloneSubtree.test.js',
  'tests/unit/searchFilter.test.js',
  'tests/unit/themeContrast.test.js',
  'tests/unit/projectStorage.test.js',
];

try {
  for (const testFile of tests) {
    execSync(`node "${testFile}"`, { stdio: 'inherit' });
  }
  console.log(`\nVerified and executed ${tests.length} test modules cleanly.`);
  console.log('All unit tests passed successfully.');
} catch (err) {
  console.error('Test execution failed:', err);
  process.exit(1);
}
