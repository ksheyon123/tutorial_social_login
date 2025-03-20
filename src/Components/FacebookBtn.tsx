import { useEffect, useState } from "react";
import Button from "@/Components/Common/Button";
import {
  getAppAccessToken,
  verifyAccessToken,
  getUserProfile,
} from "@/apis/api";

export const FaceBookSdkBtn = () => {
  const [loginStatus, setLoginStatus] = useState<string>("");
  const [data, setData] = useState<string>("");
  // Facebook 로그인 상태 콜백 함수
  const statusChangeCallback = (response: any) => {
    console.log(response);

    if (response.status === "connected") {
      // 페이스북과 웹페이지에 모두 로그인된 상태
      testAPI();
    } else {
      // 페이스북이나 웹페이지에 로그인되지 않은 상태
      setLoginStatus("페이스북 로그인이 필요합니다.");
    }
  };

  // 로그인 성공 후 사용자 정보를 가져오는 함수
  const testAPI = () => {
    console.log("Welcome! Fetching your information...");
    (window as any).FB.api("/me", function (response: any) {
      console.log(response);
      console.log("Successful login for: " + response.name);
      setLoginStatus(`${response.name}님, 환영합니다!`);
    });
  };

  // Facebook SDK 초기화
  useEffect(() => {
    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        appId:
          process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID ||
          process.env.FACEBOOK_CLIENT_ID,
        cookie: true, // 세션 액세스를 위한 쿠키 활성화
        xfbml: true, // 소셜 플러그인 파싱 활성화
        version: "v22.0", // 사용할 Graph API 버전
        popup: false,
      });

      (window as any).FB.getLoginStatus(function (response: any) {
        console.log("GET ACCESS TOKEN", response);
        // SDK 초기화 후 호출됨
        statusChangeCallback(response);
      });
    };

    // Facebook SDK가 이미 로드되었는지 확인
    if ((window as any).FB) {
      (window as any).fbAsyncInit();
    }
  }, []);

  // Facebook 로그인 처리 함수
  const handleFacebookLogin = () => {
    if ((window as any).FB) {
      (window as any).FB.login(
        (response: any) => {
          if (response.authResponse) {
            const token = response.authResponse.accessToken;
            console.log(response.authResponse);
            window.localStorage.setItem("fbac", token);
            setData(token);
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        { scope: "public_profile, email, user_link" }
      );
    } else {
      console.error("Facebook SDK가 로드되지 않았습니다.");
    }
  };

  const verify = async () => {
    const rsp = await getAppAccessToken();
    console.log(rsp);
    verifyAccessToken(data);
  };

  return (
    <div>
      <Button name="Facebook 로그인" onClick={handleFacebookLogin} />
      <Button name="GET App access token" onClick={verify} />
      <Button name="Test API" onClick={testAPI} />
      <Button name="Get Profile" onClick={() => {}} />
    </div>
  );
};
