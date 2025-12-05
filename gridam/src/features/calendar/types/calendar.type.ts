//날짜를 키로 (1 ~ 31), 날짜별 일기, 메모 존재 여부를 값으로 가짐
export type MonthlyData = Record<number, { hasDiary: boolean; hasMemo: boolean }>
