"use client";

import { useEffect, useRef } from "react";

const LoginButton = () => {
  return (
    <div className="login-button-container">
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_ID}
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri="http://localhost:3000"
        data-auto_prompt="false"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </div>
  );
};

export default LoginButton;
