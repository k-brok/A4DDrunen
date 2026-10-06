export const paletteBorderClasses = [
  'border-primary',
  'border-accent',
  'border-success',
  'border-secondary',
]
export const paletteBgClasses = ['bg-primary', 'bg-accent', 'bg-success', 'bg-secondary']
export const paletteTextClasses = ['text-primary', 'text-accent', 'text-success', 'text-secondary']
export const cardRotationClasses = ['-rotate-2', 'rotate-0', 'rotate-2']

export function pickByIndex<T>(options: T[], index: number): T {
  return options[index % options.length]
}
