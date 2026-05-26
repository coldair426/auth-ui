/**
 * HEX 색상의 밝기를 계산하여 어두운 텍스트를 사용할지 여부를 반환합니다.
 * @param hex HEX 컬러 코드 (예: #A4E1F1)
 * @returns 밝은 배경이면 true (어두운 글자 권장), 어두운 배경이면 false (밝은 글자 권장)
 */
export function isLightColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  
  // HEX를 RGB로 변환
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // HSP(Highly Sensitive Poo) 모델을 사용한 밝기 계산
  // https://awik.org/determine-color-brightness-rgb/
  const hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  // 밝기 임계값 (0~255 중 127.5 이상이면 밝은 것으로 판단)
  // 디자인 요구사항에 따라 150~180 정도로 조정하여 더 보수적으로 판단할 수 있습니다.
  return hsp > 165;
}
