/**
 *
 * @param domain Next.js Middlware receives /api/${type : instagram, facebook}/${PATHNAME}
 * @param params params for query string
 * @param headers optional headers
 * @returns
 */

const get = async (domain: string, params = {}, headers = {}) => {
  const qs = new URLSearchParams(params);
  const initHeaders: HeadersInit = {
    ...headers,
  };
  console.log(qs);
  const rsp = await fetch(`${domain}${qs ? `?${qs}` : ""} `, {
    method: "GET",
    headers: {
      ...initHeaders,
    },
  });
  if (rsp.ok) {
    const result = await rsp.json();
    return result;
  } else {
    throw new Error(JSON.stringify({ code: rsp.status }));
  }
};

const post = async (domain: string, params = {}, headers = {}) => {
  const initHeaders: HeadersInit = {
    ...headers,
  };
  const rsp = await fetch(`${domain}`, {
    method: "POST",
    headers: {
      ...initHeaders,
    },
    body: JSON.stringify(params),
  });
  if (rsp.ok) {
    const result = await rsp.json();
    return result;
  } else {
    throw new Error(JSON.stringify({ code: rsp.status }));
  }
};

export { get, post };
