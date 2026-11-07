import { describe, test, expect } from './testRunner';
import { isDarkHexColor } from '../../src/features/theme/utils/themeContrast';

describe('Theme Contrast Utility', () => {
  test('correctly identifies dark and light hex colors', () => {
    expect(isDarkHexColor('#000000')).toBe(true);
    expect(isDarkHexColor('#09090b')).toBe(true);
    expect(isDarkHexColor('#18181b')).toBe(true);
    expect(isDarkHexColor('#ffffff')).toBe(false);
    expect(isDarkHexColor('#f4f4f5')).toBe(false);
  });
});
