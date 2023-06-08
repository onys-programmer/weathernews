export default function roundToHour() {
  const date = new Date();
  const currentMinutes = date.getMinutes();

  if (currentMinutes >= 40) {
    // 현재 분이 40분 이후인 경우 현재 시간의 시간 부분만을 가져와서 "HH00" 형식으로 반환
    const hours = String(date.getHours()).padStart(2, '0');
    return hours + '00';
  } else {
    // 현재 분이 40분 이전인 경우 1시간 전의 시간의 시간 부분만을 가져와서 "HH00" 형식으로 반환
    date.setHours(date.getHours() - 1);
    const hours = String(date.getHours()).padStart(2, '0');
    return hours + '00';
  }
}
