"use client";

import { useSearchParams } from "next/navigation";

export const Token = () => {
  const param = useSearchParams();
  const accessToken = param.get("access_token");
  return (
    <div>
      <div>{accessToken}</div>
    </div>
  );
};
