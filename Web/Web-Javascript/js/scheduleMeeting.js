async function getUser() {
  const response = await ApiServices.userDetails(
    localStorage.getItem("accessToken") || ""
  );

  return [response.data.name, response.data.email];
}
async function instantMeeting(body) {
  try {
    const response = await ApiServices.scheduleMeeting(
      localStorage.getItem("accessToken") || "",
      body
    );

    if (response.success) {
      localStorage.setItem("meetingId", response.data.meeting_id);
      localStorage.setItem("pCode", response.data.pcode);
      return response;
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
}

function timeConvert(time) {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];
  if (time.length > 1) {
    time = time.slice(1);
    time[5] = Number(time[0]) < 12 ? " AM" : " PM";
    time[0] = Number(time[0]) % 12 || 12;
    if (time[0] < 10) {
      time[0] = `0${Number(time[0]) % 12}` || 12;
    }
  }

  return time.join("");
}

async function getTimezones() {
  const response = await ApiServices.timezone(
    localStorage.getItem("accessToken") || ""
  );
  response.timezones.forEach((element) => {
    const newOption = document.createElement("option");
    const optionText = document.createTextNode(element.name);
    newOption.appendChild(optionText);
    newOption.setAttribute("value", element.value);
    newOption.setAttribute("class", "w-96");
    const select = document.querySelector("select");
    select.appendChild(newOption);
  });
}

async function getContactsList() {
  if (!localStorage.getItem("accessToken")) {
    return;
  }
  const body = { limit: 0, page: 0, exclude_hosts: 0 };

  try {
    const response = await ApiServices.contactsList(
      localStorage.getItem("accessToken") || "",
      body
    );
    response.contacts.forEach((contact) => {
      const newDiv = document.createElement("div");
      const divText = document.createTextNode(
        contact.first_name + " (" + contact.email + ") "
      );
      newDiv.appendChild(divText);
      newDiv.setAttribute("value", contact.value);
      newDiv.setAttribute("id", "participant-" + contact.id);
      newDiv.setAttribute("name", contact.id);
      newDiv.setAttribute(
        "class",
        "participant text-gray-700 block px-4 py-2 text-sm cursor-pointer"
      );
      const participantsDropdown = document.querySelector(
        "#participants-dropdown"
      );
      participantsDropdown.classList.add("hidden");
      participantsDropdown.appendChild(newDiv);
    });
    response.contacts.forEach((contact) => {
      const newDiv = document.createElement("div");
      const divText = document.createTextNode(
        contact.first_name + " (" + contact.email + ") "
      );
      newDiv.appendChild(divText);
      newDiv.setAttribute("value", contact.value);
      newDiv.setAttribute("id", "moderator-" + contact.id);
      newDiv.setAttribute("name", contact.id);
      newDiv.setAttribute(
        "class",
        "moderator text-gray-700 block px-4 py-2 text-sm cursor-pointer"
      );
      const moderatorsDropdown = document.querySelector("#moderators-dropdown");
      moderatorsDropdown.classList.add("hidden");
      moderatorsDropdown.appendChild(newDiv);
    });
  } catch (error) {
    console.log(error);
  }
}

function displaySelectedParticipants(name) {
  const newDiv = document.createElement("div");
  const optionText = document.createTextNode(element.name);
  newDiv.appendChild(optionText);
  newDiv.setAttribute("value", element.value);
  newDiv.setAttribute("class", "w-96");
  const select = document.querySelector("select");
  select.appendChild(newDiv);
  appendChild(
    `<div class="flex justify-between"><h1>${name}</h1><button id='remove-button' class="border border-slate-400 rounded-md px-3">Remove</button></div>`
  );
}

const addParticipant = (participant) => {
  if (
    typeof participant !== "number" &&
    (!participant.first_name || !participant.last_name || !participant.email)
  ) {
    alert("Please set all the required fields");
    return;
  }
  const attendParticipants = requestBody.attend ? [...requestBody.attend] : [];

  if (attendParticipants.includes(participant) === false) {
    attendParticipants.push(participant);
    displaySelectedParticipants(participant);
    setRequestBody({ ...requestBody, attend: attendParticipants });
  }
};

const removeParticipant = (participant) => {
  const existing = requestBody.attend ? [...requestBody.attend] : [];

  if (existing.length === 1) {
    existing.pop();
    setRequestBody({ ...requestBody, attend: existing });

    return;
  }
  existing.splice(
    existing.indexOf(participant),
    existing.indexOf(participant) + 1
  );
  setRequestBody({ ...requestBody, attend: existing });
};

const addModerator = (moderator) => {
  const moderators = requestBody.hostusers ? [...requestBody.hostusers] : [];

  if (moderators.includes(moderator) === false) {
    moderators.push(moderator);
    setRequestBody({ ...requestBody, hostusers: moderators });
  }
};

const removeModerator = (moderator) => {
  const existing = requestBody.hostusers ? [...requestBody.hostusers] : [];

  if (existing.length === 1) {
    existing.pop();
    setRequestBody({ ...requestBody, hostusers: existing });

    return;
  }
  existing.splice(existing.indexOf(moderator), existing.indexOf(moderator) + 1);
  setRequestBody({ ...requestBody, hostusers: existing });
};
