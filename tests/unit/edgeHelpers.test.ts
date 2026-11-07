import { describe, test, expect } from './testRunner';
import { optimizeEdgeHandles } from '../../src/features/canvas/store/edgeHelpers';

describe('Edge Helpers', () => {
  test('optimizeEdgeHandles connects right to left for horizontal direction', () => {
    const nodes = [
      { id: 'src', position: { x: 100, y: 100 }, data: {} },
      { id: 'tgt', position: { x: 400, y: 100 }, data: {} },
    ] as any;
    const edges = [{ id: 'e1', source: 'src', target: 'tgt' }] as any;

    const optimized = optimizeEdgeHandles(nodes, edges);
    expect(optimized[0].sourceHandle).toBe('source-r');
    expect(optimized[0].targetHandle).toBe('target-l');
  });

  test('optimizeEdgeHandles connects left to right when target is behind source', () => {
    const nodes = [
      { id: 'src', position: { x: 400, y: 100 }, data: {} },
      { id: 'tgt', position: { x: 100, y: 100 }, data: {} },
    ] as any;
    const edges = [{ id: 'e1', source: 'src', target: 'tgt' }] as any;

    const optimized = optimizeEdgeHandles(nodes, edges);
    expect(optimized[0].sourceHandle).toBe('source-l');
    expect(optimized[0].targetHandle).toBe('target-r');
  });
});
