import {
  Card,
  Container,
  Flex,
  Heading,
  Stack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import useLocation from "./useLocation";

export default function Main() {
  const { location } = useLocation();

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
              <S.LocationText>
                위치
              </S.LocationText>
            </Card>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <S.CurrentDegree>
                <h3>7.2도</h3>
              </S.CurrentDegree>
              <S.MiddleText>
                <p>
                  체감(6.6도)
                </p>
              </S.MiddleText>
              <S.MiddleText>
                <p>
                  어제보다 5도 낮아요
                </p>
              </S.MiddleText>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <S.SmallText><p>습도 43%</p></S.SmallText>
              <S.SmallText><p>바람 남 1.5m/s</p></S.SmallText>
              <S.SmallText><p>강수량: -mm</p></S.SmallText>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Stack>
                <S.Circle>
                  21µg/m³
                </S.Circle>
                <S.SmallText>
                  <p>초 미세먼지</p>
                </S.SmallText>
                <S.SmallText>
                  <p>(PM2.5)</p>
                </S.SmallText>
                <S.SmallText>
                  <p>보통</p>
                </S.SmallText>
              </Stack>
              <Stack>
                <S.Circle>
                  34µg/m³
                </S.Circle>
                <S.SmallText>
                  <p>미세먼지</p>
                </S.SmallText>
                <S.SmallText>
                  <p>(PM10)</p>
                </S.SmallText>
                <S.SmallText>
                  <p>보통</p>
                </S.SmallText>
              </Stack>
              <Stack>
                <S.Circle>
                  0.009ppm
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