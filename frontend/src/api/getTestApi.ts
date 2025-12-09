import getResponse from "./getResponse";

export const getTestApi = async () => {
  const result = await getResponse(
    "/api/v1/users/search/members?content=ssafy"
  );
  console.log(result);
};
