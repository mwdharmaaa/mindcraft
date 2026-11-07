function describe(suiteName, fn) {
  console.log(`
[SUITE] ${suiteName}`);
  fn();
}
function test(testName, fn) {
  try {
    fn();
    console.log(`  \u2713 ${testName}`);
  } catch (err) {
    console.error(`  \u2717 ${testName}`);
    throw err;
  }
}
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected) {
      if (typeof actual !== "number" || actual <= expected) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy, received ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy, received ${actual}`);
      }
    }
  };
}
export {
  describe,
  expect,
  test
};
