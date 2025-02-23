#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertToUpperCamelCase(string) {
  return string
    .split('-')
    .map(word => capitalize(word))
    .join('');
}

function regexFile(regex, replace, filePath) {
  const file = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, file.replace(regex, replace));
}

const testFixturesDir = path.join(__dirname, '../TestFixtures');
const testFiles = fs.readdirSync(testFixturesDir);

const tests = {};
for (const fileName of testFiles) {
  const name = convertToUpperCamelCase(fileName.split('.')[0]);
  const jsonString = fs.readFileSync(path.join(testFixturesDir, fileName), 'utf8');
  const json = JSON.parse(jsonString);
  tests[name] = json;
}

// ABI44_0_0EXStructuredHeadersTestFixtures.h
const generatedConstantHeaders = `// GENERATED CONSTANTS BEGIN

${Object.keys(tests)
  .map(name => `FOUNDATION_EXPORT NSString * const ABI44_0_0EXStructuredHeaders${name}Tests;`)
  .join('\n')}

// GENERATED CONSTANTS END`;
regexFile(
  /\/\/ GENERATED CONSTANTS BEGIN\n[\s\S]*\n\/\/ GENERATED CONSTANTS END/,
  generatedConstantHeaders,
  path.join(__dirname, '../ABI44_0_0EXStructuredHeadersTestFixtures.h')
);

// ABI44_0_0EXStructuredHeadersTestFixtures.m
const generatedConstantsImpl = `// GENERATED CONSTANTS BEGIN

${Object.entries(tests)
  .map(
    ([name, json]) =>
      `NSString * const ABI44_0_0EXStructuredHeaders${name}Tests = @${JSON.stringify(JSON.stringify(json))};`
  )
  .join('\n\n')}

// GENERATED CONSTANTS END`;
regexFile(
  /\/\/ GENERATED CONSTANTS BEGIN\n[\s\S]*\n\/\/ GENERATED CONSTANTS END/,
  generatedConstantsImpl,
  path.join(__dirname, '../ABI44_0_0EXStructuredHeadersTestFixtures.m')
);

// ABI44_0_0EXStructuredHeadersParserTests.m'
const generatedXCTests = `// GENERATED TESTS BEGIN

${Object.keys(tests)
  .map(
    name => `- (void)test${name}
{
  [self runTests:ABI44_0_0EXStructuredHeaders${name}Tests];
}`
  )
  .join('\n\n')}

@end`;
regexFile(
  /\/\/ GENERATED TESTS BEGIN\n[\s\S]*\n@end/,
  generatedXCTests,
  path.join(__dirname, '../ABI44_0_0EXStructuredHeadersParserTests.m')
);
