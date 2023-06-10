export default function calcWindChill(weather) {
  const {
    degree,
    windVelocity
  } = weather;
  // 체감온도 계산식
  const windChill = 13.12 + 0.6215 * degree - 11.37 * Math.pow(windVelocity, 0.16) + 0.3965 * degree * Math.pow(windVelocity, 0.16);

  return windChill.toFixed(1); // 소수점 둘째 자리까지 반올림하여 반환
}
