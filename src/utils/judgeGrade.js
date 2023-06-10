const judgeFineDustGrade = (value) => {
  if (value <= 30) return '좋음';
  if (value <= 80) return '보통';
  if (value <= 150) return '나쁨';
  return '매우나쁨';
};

const judgeUltraFineDustGrade = (value) => {
  if (value <= 15) return '좋음';
  if (value <= 35) return '보통';
  if (value <= 75) return '나쁨';
  return '매우나쁨';
};

const judgeOzoneGrade = (value) => {
  if (value <= 0.03) return '좋음';
  if (value <= 0.09) return '보통';
  if (value <= 0.15) return '나쁨';
  return '매우나쁨';
};

export default function judgeGrade(type, value) {
  switch (type) {
    case 'fineDust':
      return judgeFineDustGrade(value);
    case 'ultraFineDust':
      return judgeUltraFineDustGrade(value);
    case 'ozone':
      return judgeOzoneGrade(value);
    default:
      return () => { };
  }
};
