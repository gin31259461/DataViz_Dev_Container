export default function opacityToHexString(percentage: number): string {
  // 確保百分比在 0 到 100 之間
  const validPercentage = Math.max(0, Math.min(100, percentage));

  // 將百分比轉換為 alpha 值（0 到 255）
  const alpha = Math.round((validPercentage / 100) * 255);

  // 將 alpha 轉換為十六進位字串
  const hexAlpha = alpha.toString(16).padStart(2, '0');

  // 回傳十六進位 alpha 字串
  return hexAlpha;
}
