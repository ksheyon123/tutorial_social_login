import { get } from "@/apis/https";

const verifyAccessToken = async (inspectToken: string) => {
  // App Access Token: 949308743408411|mg2FgTjRS90NZWAItW0p85yyI1g
  const appAccessToken = "949308743408411|mg2FgTjRS90NZWAItW0p85yyI1g";
  const rsp = await get(`https://graph.facebook.com/debug_token`, {
    input_token: inspectToken,
    access_token: appAccessToken,
  });
  console.log(rsp);
};

const getAppAccessToken = async () => {
  const rsp = await get(`https://graph.facebook.com/oauth/access_token`, {
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
    grant_type: "client_credentials",
  });
  return rsp;
};

const getUserProfile = async (accessToken: string, fields: string) => {
  try {
    const rsp = await get(`https://graph.facebook.com/v22.0/me`, {
      access_token: accessToken,
      fields,
    });
    const data = await rsp;
    return data;
  } catch (e) {
    throw e;
  }
};

export { verifyAccessToken, getAppAccessToken, getUserProfile };
