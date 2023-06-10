import { BASE_DATE, POLLUTION_SERVICE_KEY, SERVICE_KEY, YESTERDAY_DATE, yesterday } from "../constants/weatherConstants";
import roundToHour from "../utils/roundToHour";
import roundUpToHour from "../utils/roundUpToHour";

export const numOfRows = 200;
export const pageNo = 1;

export const fetchYesterdayVillageWeather = async (xy, baseDate = YESTERDAY_DATE) => {
  const YESTERDAY_BASE_TIME = roundUpToHour(yesterday);
  const { x, y } = xy;
  const response = await fetch(
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${SERVICE_KEY}&dataType=JSON&base_date=${baseDate}&base_time=${YESTERDAY_BASE_TIME}&nx=${x}&ny=${y}&numOfRows=${numOfRows}&pageNo=${pageNo}`
  );
  try {
    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const fetchVillageWeather = async (xy, baseDate = BASE_DATE) => {
  const BASE_TIME = roundToHour(new Date());
  const { x, y } = xy;
  const response = await fetch(
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${SERVICE_KEY}&dataType=JSON&base_date=${baseDate}&base_time=${BASE_TIME}&nx=${x}&ny=${y}&numOfRows=${numOfRows}&pageNo=${pageNo}`
  );
  try {
    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const fetchAirPollution = async (sidoName = "경기") => {
  const numOfRows = 1;
  const response = await fetch(
    `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${POLLUTION_SERVICE_KEY}&returnType=json&numOfRows=${numOfRows}&pageNo=1&sidoName=${sidoName}&ver=1.0`
  );
  try {
    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error);
  }
};
