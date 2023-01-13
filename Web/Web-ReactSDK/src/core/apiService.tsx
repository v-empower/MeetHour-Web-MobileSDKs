import { UpcomingMeetingsBodyType } from "./entities";

  interface PathParam {
    key: string;
    value: string
  }
  
  const apiEndpointUrl = (baseUrl: string, endpoint: string): string => {
    switch (endpoint) {
      case "login":
        return baseUrl + "/oauth/token";
      case "add_contact":
        return baseUrl + "/api/v1.1/customer/addcontact";
      case "schedule_meeting":
        return baseUrl + "/api/v1.1/meeting/schedulemeeting";
        case "get_jwt":
            return baseUrl + "/api/v1.1/getjwt"
            case "upcoming_meeting":
              return baseUrl + "/api/v1.1/meeting/upcomingmeetings"
    }
    return "Endpoint doesn't exist"
  };
  
  const substitutePathParameter = (
    url: string,
    pathParam: PathParam[] = []
  ) : string => {
    let constructedUrl = url;
    pathParam.forEach((item: PathParam) => {
      url.replace(`{${item.key}}`, !!item.value ? item.value : "");
    });
    return constructedUrl;
  };
  
  class ApiServices {
    private static BASE_URL: string = "https://api.meethour.io";
  
    private static getHeaders = () => {
      if(localStorage.getItem("accessToken"))
      return {
          "content-type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken")
      }
      return {
        "content-type": "application/json",
        authorization: "Basic"
      };
    };
    private static async postFetch(
      endpoint: string,
      body: any,
      pathParam: PathParam[] = []
    ) {
      const constructedUrl = substitutePathParameter(
        apiEndpointUrl(this.BASE_URL, endpoint),
        pathParam
      );
      try {
        const response = await fetch(constructedUrl, {
          method: "POST",
          headers: ApiServices.getHeaders(),
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token);
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    }
    private static async getFetch(
      endpoint: string,
      pathParam: PathParam[]
    ) {
      const constructedUrl = substitutePathParameter(
        apiEndpointUrl(this.BASE_URL, endpoint),
        pathParam
      );
      try {
        const response = await fetch(constructedUrl, {
          method: "GET",
          headers: ApiServices.getHeaders(),
        });
        return await response.json();
      } catch (error) {
        console.log(error);
      }
    }
  
    static async login(body: any) {
      return ApiServices.postFetch("login", body);
    }
    static async getMeetingToken(body: any) {
        return ApiServices.postFetch("get_jwt", body);
      }
    static async addContactMeethour(body: any) {
      return ApiServices.postFetch("add_contact", body);
    }
    static async scheduleMeeting(body: any) {
      return ApiServices.postFetch("schedule_meeting", body);
    }
    static async upcomingMeetings(body: UpcomingMeetingsBodyType) {
      return ApiServices.postFetch("upcoming_meeting", body);
    }
  }
  
  export default ApiServices;