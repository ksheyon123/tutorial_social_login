"use client";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { Token } from "@/app/Components/Token";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// 클라이언트 사이드에서만 렌더링할 컴포넌트를 동적으로 import
const DynamicLoginButton = dynamic(() => import("./Components/LoginButton"), {
  ssr: false,
  loading: () => <p>로딩 중...</p>,
});

export default function Home() {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // URL 해시에서 토큰 추출
  useEffect(() => {
    // 해시 파라미터에서 토큰 추출 (OAuth 리디렉션 후)
    const hash = window.location.hash;
    console.log(hash);
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        console.log("액세스 토큰 발견:", token);
        setAccessToken(token);
        setIsAuthenticated(true);
        // 토큰을 로컬 스토리지에 저장 (선택사항)
        localStorage.setItem("google_access_token", token);
        // 해시 제거 (URL 정리)
      }
    } else {
      // 로컬 스토리지에서 토큰 확인 (페이지 새로고침 시)
      const storedToken = localStorage.getItem("google_access_token");
      if (storedToken) {
        setAccessToken(storedToken);
        setIsAuthenticated(true);
      }
    }
  }, []);

  // 액세스 토큰이 있을 경우 사용자 정보 가져오기
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     if (accessToken) {
  //       try {
  //         // Google API를 사용하여 사용자 정보 가져오기
  //         const response = await fetch(
  //           "https://www.googleapis.com/oauth2/v2/userinfo",
  //           {
  //             headers: {
  //               Authorization: `Bearer ${accessToken}`,
  //             },
  //           }
  //         );

  //         if (response.ok) {
  //           const data = await response.json();
  //           setUserInfo(data);
  //           console.log("사용자 정보:", data);
  //         } else {
  //           console.error("사용자 정보 가져오기 실패:", response.statusText);
  //           // 토큰이 만료되었거나 유효하지 않은 경우
  //           if (response.status === 401) {
  //             localStorage.removeItem("google_access_token");
  //             setAccessToken(null);
  //             setIsAuthenticated(false);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("사용자 정보 요청 오류:", error);
  //       }
  //     }
  //   };

  //   if (accessToken) {
  //     fetchUserInfo();
  //   }
  // }, [accessToken]);

  // Google OAuth 로그인 처리
  const handleGoogleLogin = () => {
    const params = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
      redirect_uri: "http://localhost:3000",
      response_type: "token",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      include_granted_scopes: "true",
      state: "pass-through-value",
    };

    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    const form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2Endpoint);

    for (const p in params) {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", (params as any)[p]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("google_access_token");
    setAccessToken(null);
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  useEffect(() => {
    // Google 클라이언트 로드 확인
    if (window.google && window.google.accounts && window.google.accounts.id) {
      const callback = (e: any) => {
        console.log(e);
        // "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNDI1NjAyOTU0NTYtaTRlYW92M2ZmM2k1czF2cG5vZjhkaW9vODFncDNpY3UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNDI1NjAyOTU0NTYtaTRlYW92M2ZmM2k1czF2cG5vZjhkaW9vODFncDNpY3UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQxNDU0NDAyMjMzMDQ5OTY1ODEiLCJlbWFpbCI6ImtzaHllb24xMjNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MjQyOTEzNSwibmFtZSI6InNlb2h5dW4gS2FuZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLVkNyLUNKNlFCVW1aQ2prb0FISnhVOTRVelZCeEJ0YlBNNG1lSjFBMElKcVVGX3c9czk2LWMiLCJnaXZlbl9uYW1lIjoic2VvaHl1biIsImZhbWlseV9uYW1lIjoiS2FuZyIsImlhdCI6MTc0MjQyOTQzNSwiZXhwIjoxNzQyNDMzMDM1LCJqdGkiOiJlMTgxMjVjZjJhYzIyZTc0ZWQxOTFjZThlNzU2M2ZlNjIyYTFiMjc5In0.iq3p7XtLyEmNj4dWWHF3XnsOZdIGToXXbLi41UT6-uOJtoMSdDPZ5gXlx53drFTN-Jf-XzaU9qoPLWWwWTiEdHoVX3FM-OEVfs9QUnSlUWkkpR9fn8e_16-RD2qiRibCDSQUWvYnrrTiyV_viqq8Szgq5eXLxQB1I7XJmsNCn8Qn3qfEq1wjq8d1NYm51C-PK-XPNR54wRXxbQtRfJW5fBDloHYHZEc6OKQn0iOpX-nbdXHm2G8As3-JcqQ_z9dh9REnUtvD7FC09CFQxVUHJIUCQyrIMvD8BykkHmK7p5Gn8wFOtsZrhR_D0U4RRSXswISLzaLd35cmy-Pw4Fb1yw"
      };
      // Google Identity Services 초기화
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
        use_fedcm_for_prompt: true,
        use_fedcm_for_button: true,
        callback,
      });

      // 버튼 렌더링
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline", // 'outline' 또는 'filled_blue', 'filled_black' 등
        size: "large", // 'large' 또는 'medium', 'small'
        type: "standard", // 'standard' 또는 'icon'
        text: "signin_with", // 'signin_with' 또는 'signup_with', 'continue_with', 'signin'
        shape: "rectangular", // 'rectangular' 또는 'pill', 'circle', 'square'
        logo_alignment: "left", // 'left' 또는 'center'
        width: "280", // 픽셀 단위의 버튼 너비
      });
    } else {
      // Google 클라이언트가 로드되지 않은 경우
      console.error("Google Identity Services가 로드되지 않았습니다.");
    }
  }, []);

  const loginWithFedCM = async () => {
    if ("IdentityCredential" in window) {
      try {
        // 환경 변수가 제대로 설정되었는지 확인
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_ID;
        if (!googleClientId) {
          console.error("Google Client ID is not configured");
          return;
        }

        console.log("FedCM 시작: Client ID:", googleClientId);

        // FedCM 요청 구성
        const credentialRequest = {
          identity: {
            providers: [
              {
                configURL: "https://accounts.google.com/gsi/fedcm/config",
                clientId: googleClientId,
                // 사용자가 이미 로그인했다면 active, 아니면 silent나 permission 모드
                mode: "active",
                nonce: generateRandomNonce(), // 보안을 위한 난수 생성 함수
              },
            ],
          },
        };

        // FedCM API로 자격 증명 요청
        const credential = await navigator.credentials.get(credentialRequest);
        console.log("인증 성공:", credential);

        // 토큰 검증 및 사용자 로그인 처리
        // ...

        return credential;
      } catch (error) {
        console.error("FedCM 로그인 오류:", error);
      }
    } else {
      console.log(
        "FedCM이 지원되지 않습니다. 대체 로그인 방식으로 전환합니다."
      );
      // 대체 로그인 방식 구현 (OAuth 리디렉션 등)
    }
  };

  // 보안을 위한 임의의 nonce 생성 함수
  const generateRandomNonce = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  return (
    <main className={styles.main}>
      <h1>서비스별 OAuth 인증 예제</h1>

      <section>
        <h3>Facebook</h3>
      </section>
    </main>
  );
}
