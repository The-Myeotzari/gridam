// Textarea 입력 로직 유틸 (값 정규화, 상태 반영, DOM 교정, 변경 전파 등)
export type NormalizeFn = (input: string, max: number) => string

// 사용자가 입력한 값을 정규화하고 내부 상태·onChange에 반영하는 함수
export function setValueNormalized(
  nextValue: string,
  maxLength: number,
  normalize: NormalizeFn,
  setInnerValue: (v: string) => void,
  notifyChange?: (next: string) => void
): string {
  const normalized = normalize(nextValue, maxLength)
  setInnerValue(normalized)
  notifyChange?.(normalized)
  return normalized
}

// 실제 contentEditable 영역의 텍스트를 정규화하고, 원본과 다를 경우 DOM(textContent)을 교정하는 함수
export function handleInputOnce(
  contentElement: HTMLDivElement | null,
  maxLength: number,
  normalize: NormalizeFn
): string {
  if (!contentElement) return ''
  const rawText = contentElement.textContent ?? ''
  const normalizedText = normalize(rawText, maxLength)
  if (rawText !== normalizedText) contentElement.textContent = normalizedText
  return normalizedText
}

// 제어형/비제어형 입력을 구분해 내부 상태와 onChange를 일관되게 업데이트하는 함수
export function propagateChange(
  normalizedText: string,
  isControlledInput: boolean,
  currentInnerValue: string,
  setInnerValue: (v: string) => void,
  notifyChange?: (next: string) => void
): void {
  if (isControlledInput) {
    notifyChange?.(normalizedText)
    return
  }
  if (normalizedText !== currentInnerValue) {
    setInnerValue(normalizedText)
    notifyChange?.(normalizedText)
  }
}
