import * as THREE from 'three'

export function getCSSColor(varName: string): THREE.Color {
  const root = getComputedStyle(document.documentElement)
  const value = root.getPropertyValue(varName).trim()
  return new THREE.Color(value)
}
