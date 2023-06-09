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
import { fetchVillageWeather, fetchYesterdayVillageWeather } from "./services/api";
import { YESTERDAY_DATE } from "./constants/weatherConstants";
import { refineWeatherData, refineYesterdayWeatherData } from "./utils/refine";

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

  const initialPolution = {
    ultraFineDust: 21,
    fineDust: 34,
    ozone: 0.009,
  };

  const { location } = useLocation();
  const [locationText, setLocationText] = useState(null);
  const [xy, setXY] = useState(null);
  const [weatherResponse, setWeatherResponse] = useState(null);
  const [weather, setWeather] = useState(initialWeather);
  const [yesterdayWeatherResponse, setYesterdayWeatherResponse] = useState(null);
  const [yesterdayWeather, setYesterdayWeather] = useState(initialWeather);

  const [polution, setPolution] = useState(initialPolution);

  const {
    degree: currentDegree,
    windChill,
    humidity,
    windVelocity,
    windDirection,
    precipitation,
  } = weather;
  const { degree: yesterdayDegree } = yesterdayWeather;

  const {
    ultraFineDust,
    fineDust,
    ozone,
  } = polution

  const mapElement = useRef(null);

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

  return (
    <S.Container>
      <Card margin={"0 auto"} width="100%" padding="80px 50px">
        <Flex>
          <Container width="30%">
            <Heading as="h1" size="2xl">
              Weather I
            </Heading>
          </Container>
          <Stack spacing={4} width={"70%"} padding="20px">
            <Card width="500px" height="40px" justifyContent={"center"} alignItems="center" backgroundColor={"#e2e2e2"}>
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
                  체감({windChill})도
                </p>
              </S.MiddleText>
              <S.MiddleText>
                <p>
                  어제보다 {Math.abs(currentDegree - yesterdayDegree).toFixed(0)}도 {currentDegree - yesterdayDegree > 0 ? "높아요" : "낮아요"}
                </p>
              </S.MiddleText>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <S.SmallText><p>습도 {humidity}%</p></S.SmallText>
              <S.SmallText><p>바람 {degreeToDirection(windDirection)} {windVelocity}m/s</p></S.SmallText>
              <S.SmallText><p>강수량: {precipitation === 0 ? "-" : precipitation}mm</p></S.SmallText>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Stack>
                <S.Circle>
                  {ultraFineDust}µg/m³
                </S.Circle>
                <S.SmallText>
                  <p>초 미세먼지</p>
                </S.SmallText>
                <S.SmallText>
                  <p>({formatAMPM(new Date())})</p>
                </S.SmallText>
                <S.SmallText>
                  <p>보통</p>
                </S.SmallText>
              </Stack>
              <Stack>
                <S.Circle>
                  {fineDust}µg/m³
                </S.Circle>
                <S.SmallText>
                  <p>미세먼지</p>
                </S.SmallText>
                <S.SmallText>
                  <p>({formatAMPM(new Date())})</p>
                </S.SmallText>
                <S.SmallText>
                  <p>보통</p>
                </S.SmallText>
              </Stack>
              <Stack>
                <S.Circle>
                  {ozone}ppm
                </S.Circle>
                <S.SmallText>
                  <p>오존(O3)</p>
                </S.SmallText>
                <S.SmallText>
                  <p>좋음</p>
                </S.SmallText>
                <S.SmallText>
                  <p>보통</p>
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
  Circle: styled.div`
    width: fit-content;
    height: fit-content;
    padding: 20px;
    border-radius: 50%;
    border: 1px solid black;
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
    * {
      font-size: 18px;
    }
  `,
}