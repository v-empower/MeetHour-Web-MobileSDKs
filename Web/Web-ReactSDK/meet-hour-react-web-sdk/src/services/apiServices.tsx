import LoginType from "../types/LoginType";
import { API_VERSION, GRANT_TYPE } from "../constants";
import ScheduleMeetingType from "../types/ScheduleMeetingType";
import AddContactType from "../types/AddContactType";
import GenerateJwtType from "../types/GenerateJwtType";
import ContactsType from "../types/ContactsType";
import RecordingsList from "../types/RecordingsList";
import EditMeetingType from "../types/EditMeetingType";
import EditContactType from "../types/EditContactType";
import RefreshTokenType from "../types/RefreshTokenType";
import axios from "axios";

interface PathParam {
  key: string;
  value: string;
}

type ApiEndpoint =
  | "add_contact"
  | "login"
  | "schedule_meeting"
  | "get_jwt"
  | "upcoming_meeting"
  | "timezone"
  | "recordings_list"
  | "edit_meeting"
  | "edit_contact"
  | "view_meeting" | "archive_meeting" | "missed_meetings" | "completed_meetings" | "user_details" | "refresh_token" | "contacts_list";

const apiEndpointUrl = (baseUrl: string, endpoint: ApiEndpoint): string => {
  switch (endpoint) {
    case "login":
      return baseUrl + "/oauth/token";
    case "add_contact":
      return baseUrl + `/api/${API_VERSION}/customer/addcontact`;
    case "contacts_list":
      return baseUrl + `/api/${API_VERSION}/customer/contacts`
    case "schedule_meeting":
      return baseUrl + `/api/${API_VERSION}/meeting/schedulemeeting`;
    case "get_jwt":
      return baseUrl + `/api/${API_VERSION}/getjwt`;
    case "upcoming_meeting":
      return baseUrl + `/api/${API_VERSION}/meeting/upcomingmeetings`;
    case "timezone":
      return baseUrl + `/api/${API_VERSION}/getTimezone`;
    case "recordings_list":
      return baseUrl + `/api/${API_VERSION}/customer/videorecordinglist`;
    case "edit_meeting":
      return baseUrl + `/api/${API_VERSION}/meeting/editmeeting`;
    case "edit_contact":
      return baseUrl + `/api/${API_VERSION}/customer/editcontact`;
    case "view_meeting":
      return baseUrl + `/api/${API_VERSION}/meeting/viewmeeting`;
    case "archive_meeting":
      return baseUrl + `/api/${API_VERSION}/meeting/archivemeetin`
    case "missed_meetings":
      return baseUrl + `/api/${API_VERSION}/meeting/missedmeetings`;
    case "completed_meetings":
      return baseUrl + `/api/${API_VERSION}/meeting/completedmeeting`
    case "user_details":
      return baseUrl + `/api/${API_VERSION}/customer/user_detail`
    case "refresh_token":
      return baseUrl + "/oauth/token"
  }
};

const substitutePathParameter = (
  url: string,
  pathParam: PathParam[] = []
): string => {
  let constructedUrl = url;
  pathParam.forEach((item: PathParam) => {
    url.replace(`{${item.key}}`, !!item.value ? item.value : "");
  });
  return constructedUrl;
};

class ApiServices {
  private static BASE_URL: string = "https://api.meethour.io";

  private static getHeaders = (token: string) => {
    return {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    };
  };
  private static async postFetch(
    token: string,
    endpoint: ApiEndpoint,
    body: any,
    pathParam: PathParam[] = []
  ) {
    const constructedUrl = substitutePathParameter(
      apiEndpointUrl(this.BASE_URL, endpoint),
      pathParam
    );
    try {
      const response = await axios.post(constructedUrl, JSON.stringify(body), {
        method: "POST",
        headers: ApiServices.getHeaders(token),
      });
      if(response.status >=400 && response.status<600){
        console.log("Bad response from server.", response)
        return null
      }
      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }

  static async login(
    {
      grant_type = GRANT_TYPE,
      client_id,
      client_secret,
      username,
      password,
    }: LoginType
  ) {
    return ApiServices.postFetch("","login", {
      grant_type,
      client_id,
      client_secret,
      username,
      password,
    });
  }
  static async getRefreshToken(token: string, body: RefreshTokenType){
    return ApiServices.postFetch(token, "refresh_token", body)
  }
  static async userDetails(token: string) {
    return ApiServices.postFetch(token, "user_details", {})
  }
  static async generateJwt(token: string, body: GenerateJwtType) {
    return ApiServices.postFetch(token, "get_jwt", body);
  }
  static async addContact(token: string, body: AddContactType) {
    return ApiServices.postFetch(token, "add_contact", body);
  }
  static async timezone(token: string) {
    return ApiServices.postFetch(token, "timezone", {});
  }
  static async contactsList(token: string, body: ContactsType) {
    return ApiServices.postFetch(token, "contacts_list", body);
  }
  static async editContact(token: string, body: EditContactType) {
    return ApiServices.postFetch(token, "edit_contact", body);
  }


  // Meeting API calling functions are declared below :
  static async scheduleMeeting(token: string, body: ScheduleMeetingType) {
    return ApiServices.postFetch(token, "schedule_meeting", body);
  }
  static async upcomingMeetings(
    token: string,
    body: {
      limit: number;
      page: number;
    }
  ) {
    return ApiServices.postFetch(token, "upcoming_meeting", body);
  }
  static async archiveMeeting(
    token: string,
    body: {
      id?: number;
    }
  ) {
    return ApiServices.postFetch(token, "archive_meeting", body);
  }
  static async missedMeetings(
    token: string,
    body: {
      limit: number,
      page: number
    }
  ) {
    return ApiServices.postFetch(token, "missed_meetings", body);
  }
  static async completedMeetings(
    token: string,
    body: {
      limit: number,
      page: number
    }
  ) {
    return ApiServices.postFetch(token, "completed_meetings", body);
  }
  static async editMeeting(token: string, body: EditMeetingType) {
    return ApiServices.postFetch(token, "edit_meeting", body);
  }
  static async viewMeeting(token: string, body: { meeting_id: string }) {
    return ApiServices.postFetch(token, "view_meeting", body);
  }
  static async recordingsList(token: string, body: RecordingsList) {
    return ApiServices.postFetch(token, "recordings_list", body);
  }
  // Meeting API calling functions are declared above :
}

export default ApiServices;
