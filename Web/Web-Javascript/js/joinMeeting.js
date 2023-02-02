const generateJwtToken = async (id) => {
  try {
    const body = {
      meeting_id: meetingId,
      contact_id: id,
    };
    const response = await ApiServices.generateJwt(
      localStorage.getItem("accessToken") || "",
      body
    );
  } catch (error) {
    console.log(error);
  }
};

const viewMeeting = async () => {
  if (!localStorage.getItem("meetingId")) {
    return;
  }
  try {
    const accessToken = localStorage.getItem("accessToken") || "";
    const id = localStorage.getItem("meetingId") || "";
    const response = await ApiServices.viewMeeting(accessToken, {
      meeting_id: id,
    });
    const meetingBody = {
      organizer: response.organizer,
      hosts: response.meeting.hosts,
      attendees: response.meeting.meeting_attendees,
    };
  } catch (error) {
    localStorage.removeItem("meetingId");
    console.log(error);
  } finally {
  }
};
