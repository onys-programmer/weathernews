export default function degreeToDirection(degree) {
  if (degree >= 337.5 || degree < 22.5) {
    return "북";
  } else if (degree >= 22.5 && degree < 67.5) {
    return "북동";
  } else if (degree >= 67.5 && degree < 112.5) {
    return "동";
  } else if (degree >= 112.5 && degree < 157.5) {
    return "남동";
  } else if (degree >= 157.5 && degree < 202.5) {
    return "남";
  } else if (degree >= 202.5 && degree < 247.5) {
    return "남서";
  } else if (degree >= 247.5 && degree < 292.5) {
    return "서";
  } else if (degree >= 292.5 && degree < 337.5) {
    return "북서";
  } else {
    return "유효하지 않은 도";
  }
}