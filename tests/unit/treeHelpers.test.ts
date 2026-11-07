import { describe, test, expect } from './testRunner';
import { getAllDescendantIds, calculateChildPosition, calculateSiblingPosition } from '../../src/features/canvas/store/treeHelpers';

describe('Tree Helpers', () => {
  test('getAllDescendantIds finds all transitive children', () => {
    const edges = [
      { id: 'e1', source: 'root', target: 'c1' },
      { id: 'e2', source: 'c1', target: 'c2' },
      { id: 'e3', source: 'c2', target: 'c3' },
      { id: 'e4', source: 'root', target: 'other' },
    ] as any;

    const descendants = getAllDescendantIds('root', edges);
    expect(descendants.has('c1')).toBeTruthy();
    expect(descendants.has('c2')).toBeTruthy();
    expect(descendants.has('c3')).toBeTruthy();
    expect(descendants.has('other')).toBeTruthy();
    expect(descendants.size).toBe(4);
  });

  test('calculateChildPosition fans out children cleanly', () => {
    const parent = { position: { x: 100, y: 100 }, data: {} } as any;
    const pos0 = calculateChildPosition(parent, 0);
    const pos1 = calculateChildPosition(parent, 1);
    expect(pos0.x).toBe(350);
    expect(pos0.y).toBe(100);
    expect(pos1.x).toBe(350);
    expect(pos1.y).toBe(180);
  });

  test('calculateSiblingPosition places sibling below target', () => {
    const target = { position: { x: 200, y: 300 } } as any;
    const siblingPos = calculateSiblingPosition(target);
    expect(siblingPos.x).toBe(200);
    expect(siblingPos.y).toBe(380);
  });
});
