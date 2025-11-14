// 원고지 형태의 격자(Textarea)의 셀 크기, 전체 너비, 높이, CSS 스타일을 계산하는 유틸

// 셀 크기(cell)와 전체 그리드 너비(gridWidth) 계산
// - cellSize가 지정되면 그대로 사용, 없으면 width/cols로 자동 계산
// export function getCellSize(width: number, cols: number, cellSize?: number) {
//   const cell = typeof cellSize === 'number' ? Math.floor(cellSize) : Math.floor(width / cols)
//   const gridWidth = cell * cols
//   return { cell, gridWidth }
// }

// CSS Grid 스타일 생성
// gridTemplateColumns: 열 개수(cols)와 각 셀 크기(cell) 지정
// gridAutoRows: 각 행 높이를 셀 크기로 고정
export function gridStyle(cols: number, cell: number): React.CSSProperties {
  return {
    gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
    gridAutoRows: `${cell}px`,
  }
}

// 콘텐츠 전체 높이(contentHeight)와 뷰포트 높이(viewportH) 계산
// totalRows: 총 행 수
// visibleRows: 화면에 표시할 행 수
export function heights(totalRows: number, visibleRows: number, cell: number) {
  const contentHeight = totalRows * cell
  const viewportH = visibleRows * cell
  return { contentHeight, viewportH }
}
