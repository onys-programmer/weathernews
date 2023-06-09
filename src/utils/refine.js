import categoryMap from "../constants/categoryMap";

export const refineWeatherData = (items) => {
  const result = {};
  // console.log(items, 'items at refineWeatherData')
  if (items.length > 0) {
    Object.values(items)?.forEach((item) => {
      const { category, obsrValue } = item;
      // console.log(category, obsrValue, 'category, obsrValue')
      Object.entries(categoryMap).forEach(([key, value]) => {
        if (key === category) {
          result[value] = obsrValue;
        }
      });
    });
  }
  // console.log(result, 'result')
  return result;
};

export const refineYesterdayWeatherData = (items) => {
  const result = {};
  if (items.length > 0) {
    Object.values(items)?.forEach((item) => {
      const { category, fcstValue } = item;
      if (category === 'TMP') {
        result['degree'] = fcstValue;
      }
    });
  }
  return result;
}

