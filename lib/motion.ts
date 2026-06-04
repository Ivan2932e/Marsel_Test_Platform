/**
 * Общий easing для всей платформы. Тип явный — иначе TS вшивает number[],
 * а Framer Motion v12 ждёт кортеж [number, number, number, number].
 */
export const easeOutSoft: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];
