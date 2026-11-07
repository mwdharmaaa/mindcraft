export function getEdgeStrokeColor(sourceColor?: string, defaultColor = '#71717a'): string {
  if (!sourceColor) return defaultColor;
  return sourceColor;
}

export function getEdgeHoverColor(baseColor = '#71717a'): string {
  return '#e4e4e7';
}
