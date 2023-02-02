async function getaccessToken() {
  const loginBody = {
    client_id: "890py815uk6xpy2qz2ozup60y9xw15q530tx",
    client_secret:
      "a7b7ca34db7d7c54d76cb1dbe94f41a353e425d7a660865e7cf86a5d824ae033",
    username: "zeeshan.ali@v-empower.com",
    password: "u98Iu9wA",
  };
  try {
    const response = await ApiServices.login(loginBody);

    localStorage.setItem("accessToken", response?.access_token);
    return response?.access_token;
  } catch (error) {
    console.log(error);
  } finally {
  }
}