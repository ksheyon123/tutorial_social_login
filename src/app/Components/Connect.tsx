"use client";

export const ConnectBtn = () => {
  const authApi = async () => {
    const params = {
      client_id:
        "142560295456-i4eaov3ff3i5s1vpnof8dioo81gp3icu.apps.googleusercontent.com",
      redirect_uri: "http://localhost:3000",
      response_type: "token",
      scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
      include_granted_scopes: "true",
      state: "pass-through value",
    };
    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    const qs = new URLSearchParams(params);
    const rsp = await fetch(`${oauth2Endpoint}?${qs}`, {
      method: "GET",
    });
    console.log(rsp);
  };

  const fetchAuth = async () => {
    const params = {
      client_id:
        "142560295456-i4eaov3ff3i5s1vpnof8dioo81gp3icu.apps.googleusercontent.com",
      redirect_uri: "http://localhost:3000",
      response_type: "token",
      scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
      include_granted_scopes: "true",
      state: "pass-through value",
    };
    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    const form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.

    // Add form parameters as hidden input values.
    for (const p in params) {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", (params as any)[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };
  const onClick = () => {
    authApi();
  };
  return <div onClick={() => onClick()}>Click</div>;
};
