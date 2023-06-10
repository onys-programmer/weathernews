import {
  Card,
  Container,
  Flex,
  Heading,
  Stack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import useLocation from "./useLocation";
import { useEffect, useRef, useState } from "react";
import convertCoordinates from "./utils/convertCoordinates";
import formatAMPM from "./utils/formatAMPM";
import degreeToDirection from "./utils/degreeToDirection";
import { fetchAirPollution, fetchVillageWeather, fetchYesterdayVillageWeather } from "./services/api";
import { YESTERDAY_DATE } from "./constants/weatherConstants";
import { refineWeatherData, refineYesterdayWeatherData } from "./utils/refine";
import takeSidoName from "./utils/takeSidoName";
import judgeGrade from "./utils/judgeGrade";
import calcWindChill from "./utils/calcWindChill";

export default function Main() {
  const initialWeather = {
    currentDegree: 7.2,
    yesterdayDegree: 12.2,
    windChill: 6.6,
    humidity: 43,
    windVelocity: 1.5,
    windDirection: "남",
    precipitation: 0,
  };

  const initialPollution = {
    ultraFineDust: 21,
    ultraFineDustGrade: "보통",
    fineDust: 34,
    fineDustGrade: "보통",
    ozone: 0.009,
    ozoneGrade: "보통",
  };

  const { location } = useLocation();
  const [locationText, setLocationText] = useState(null);
  const [xy, setXY] = useState(null);
  const [weatherResponse, setWeatherResponse] = useState(null);
  const [weather, setWeather] = useState(initialWeather);
  const [yesterdayWeatherResponse, setYesterdayWeatherResponse] = useState(null);
  const [yesterdayWeather, setYesterdayWeather] = useState(initialWeather);

  const [pollutionResponse, setPollutionResponse] = useState(null);
  const [pollution, setPollution] = useState(initialPollution);

  const {
    degree: currentDegree,
    humidity,
    windVelocity,
    windDirection,
    precipitation,
  } = weather;
  const { degree: yesterdayDegree } = yesterdayWeather;

  const {
    ultraFineDust,
    ultraFineDustGrade,
    fineDust,
    fineDustGrade,
    ozone,
    ozoneGrade,
  } = pollution

  const mapElement = useRef(null);

  const generateCircleColor = (grade) => {
    switch (grade) {
      case "좋음":
        return "#b9d2de";
      case "보통":
        return "#b4d2b8";
      case "나쁨":
        return "#d6c0ac";
      case "매우나쁨":
        return "#e5bdbd";
      default:
        return "#dbdbdb";
    }
  };

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      const { longitude, latitude } = location;
      // console.log(longitude, latitude);
      const { x, y } = convertCoordinates("toXY", latitude, longitude);
      setXY({ x, y });
      const { kakao } = window;
      const geocoder = new kakao.maps.services.Geocoder();

      const callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const addressName = result[0].address_name;
          setLocationText(addressName);
        }
      };

      const getLocationText = async () => {
        const locationText = await geocoder.coord2RegionCode(longitude, latitude, callback);
        setLocationText(locationText);
      };

      getLocationText();
    }
  }, [location]);

  useEffect(() => {
    async function fetchWeather() {
      if (xy?.x && xy?.y) {
        const res = await fetchVillageWeather(xy);
        // console.log(res, 'res')

        setWeatherResponse(res?.response?.body?.items.item);
        const yesterdayRes = await fetchYesterdayVillageWeather(xy, YESTERDAY_DATE);
        // console.log(yesterdayRes, 'yes day res')
        setYesterdayWeatherResponse(yesterdayRes?.response?.body?.items.item);
      }
    }
    fetchWeather();
  }, [xy]);

  useEffect(() => {
    if (weatherResponse) {
      const refinedWeather = refineWeatherData(weatherResponse);
      // console.log(weatherResponse, 'weatherResponse')
      setWeather(refinedWeather);
    }
  }, [weatherResponse])

  useEffect(() => {
    // console.log(yesterdayWeatherResponse, 'yesterdayWeatherResponse')
    if (yesterdayWeatherResponse) {
      // console.log(yesterdayWeatherResponse, 'yesterdayWeatherResponse')
      const refinedWeather = refineYesterdayWeatherData(yesterdayWeatherResponse);
      setYesterdayWeather(refinedWeather);
    }
  }, [yesterdayWeatherResponse])

  useEffect(() => {
    async function fetchPollution() {
      if (locationText?.length > 0) {
        const sidoName = takeSidoName(locationText);
        const res = await fetchAirPollution(sidoName);
        setPollutionResponse(res?.response?.body?.items[0]);
      }
    }
    fetchPollution();
  }, [locationText]);

  useEffect(() => {
    if (pollutionResponse) {
      const { pm10Value, pm25Value, o3Value } = pollutionResponse;
      setPollution({
        ultraFineDust: pm25Value,
        ultraFineDustGrade: judgeGrade('ultraFineDust', pm25Value),
        fineDust: pm10Value,
        fineDustGrade: judgeGrade('fineDust', pm10Value),
        ozone: o3Value,
        ozoneGrade: judgeGrade('ozone', o3Value),
      });
    }
  }, [pollutionResponse]);

  return (
    <S.Container>
      <Card margin={"0 auto"} width="1100px" padding="50px 10px">
        <Flex justifyContent={"space-around"}>
          <S.SideBar>
            <Heading as="h1" size="2xl">
              Weather I
            </Heading>
            <S.TimeText>
              <p>({formatAMPM(new Date())})</p>
            </S.TimeText>
          </S.SideBar>
          <Stack gap="30px" width={"100%"} maxW={"600px"} padding="20px">
            <Card width="100%" height="40px" justifyContent={"center"} alignItems="center" backgroundColor={"#e2e2e2"}>
              <S.LocationText ref={mapElement}>
                <p>{locationText}</p>
              </S.LocationText>
            </Card>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <S.CurrentDegree>
                <h3>{currentDegree}도</h3>
              </S.CurrentDegree>
              <S.MiddleText>
                <p>
                  체감({calcWindChill(weather)})도
                </p>
              </S.MiddleText>
              <S.MiddleText>
                <p>
                  어제보다 {Math.abs(currentDegree - yesterdayDegree).toFixed(0)}도 {currentDegree - yesterdayDegree > 0 ? "높아요" : "낮아요"}
                </p>
              </S.MiddleText>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"space-between"} gap="30px">
              <S.SmallText><p>습도 {humidity}%</p></S.SmallText>
              <S.SmallText><p>바람 {degreeToDirection(windDirection)} {windVelocity}m/s</p></S.SmallText>
              <S.SmallText><p>강수량: {precipitation === 0 ? "-" : precipitation}mm</p></S.SmallText>
            </Flex>
            <Flex alignItems={"flex-start"} justifyContent={"space-around"} border="1px solid #ebebeb" borderRadius={"10px"} padding="40px 10px">
              <Stack gap="12px">
                <S.Circle style={{ backgroundColor: generateCircleColor(ultraFineDustGrade) }}>
                  {ultraFineDust}µg/m³
                </S.Circle>
                <S.SmallText>
                  <p>초 미세먼지</p>
                  <S.SmallP>(PM2.5)</S.SmallP>
                </S.SmallText>
                <S.SmallText>
                  <p>{ultraFineDustGrade}</p>
                </S.SmallText>
              </Stack>
              <Stack gap="12px">
                <S.Circle style={{ backgroundColor: generateCircleColor(fineDustGrade) }}>
                  {fineDust}µg/m³
                </S.Circle>
                <S.SmallText>
                  <p>미세먼지</p>
                  <S.SmallP>(PM10)</S.SmallP>
                </S.SmallText>
                <S.SmallText>
                  <p>{fineDustGrade}</p>
                </S.SmallText>
              </Stack>
              <Stack gap="12px">
                <S.Circle style={{ backgroundColor: generateCircleColor(ozoneGrade) }}>
                  {ozone}ppm
                </S.Circle>
                <S.SmallText>
                  <p>오존</p>
                  <S.SmallP>(O₃)</S.SmallP>
                </S.SmallText>
                <S.SmallText>
                  <p>{ozoneGrade}</p>
                </S.SmallText>
              </Stack>
            </Flex>
          </Stack>
        </Flex>
      </Card>
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    margin: 0 auto;
    width: 70%;
    padding: 50px;
  `,
  SideBar: styled.div`
    padding-top: 15px;
    width: 250px;
  `,
  Circle: styled.div`
    width: fit-content;
    height: fit-content;
    padding: 20px;
    border-radius: 50%;
    border: 1px solid #eeeeee;
    background-color: #e2e2e2;
  `,
  CurrentDegree: styled.div`
    * {
      font-size: 50px;
    }
  `,
  LocationText: styled.p`
    font-size: 20px;
  `,
  MiddleText: styled.div`
    * {
      font-size: 20px;
    }
  `,
  SmallText: styled.div`
    border: 1px solid #c7c7c7;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    width: 100%;
    * {
      font-size: 18px;
    }
  `,
  TimeText: styled.div`
    margin: 10px auto;
  `,
  SmallP: styled.p`
    font-size: 14px;
  `,
}
