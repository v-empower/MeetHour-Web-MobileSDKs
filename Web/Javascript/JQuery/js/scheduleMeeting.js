async function getUser() {
    const response = await ApiServices.userDetails(
      localStorage.getItem("accessToken") || ""
    );
  
    return [response?.data?.name, response?.data?.email];
  };
  async function instantMeeting(body) {
    const loader = document.createElement("div")
    loader.setAttribute("class", "loader")
    document.querySelector("#instant-meeting-loader").appendChild(loader)
    try {
      const response = await ApiServices.scheduleMeeting(
        localStorage.getItem("accessToken") || "",
        body
      );
      console.log(response)
      if (response === null) {
        throw "error"
      }
      else{
        return response
      }
    } catch (error) {
      const displayError = document.createElement("div")
                    displayError.setAttribute("class", "flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600")
                    const errorParagraph = document.createElement("p")
                    const errorText = document.createTextNode("Something went wrong! Please inspect and try to find the error in the network tab.")
                    errorParagraph.appendChild(errorText)
                    displayError.appendChild(errorParagraph)
                    document.querySelector("#error").appendChild(displayError)
                    setTimeout(() => {
                        document.querySelector("#error").remove( )
                    }, 3000)
      console.log(error);
    } finally {
      document.querySelector(".loader").remove()
    }
  };
  
  function timeConvert(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [ time ];
    if (time.length > 1) {
        time = time.slice(1);
        time[5] = Number(time[0]) < 12 ? ' AM' : ' PM';
        time[0] = Number(time[0]) % 12 || 12;
        if (time[0] < 10) {
            time[0] = `0${Number(time[0]) % 12}` || 12;
        }
    }
  
    return time.join('').split(" ");
  }
  
  async function getTimezones() {
    const response = await ApiServices.timezone(localStorage.getItem("accessToken") || "")
    response?.timezones?.forEach(element => {
      const newOption = document.createElement('option');
      const optionText = document.createTextNode(element.name);
      newOption.appendChild(optionText);
      newOption.setAttribute('value',element.value);
      newOption.setAttribute('class', 'w-96')
      const select = document.querySelector('select'); 
      select.appendChild(newOption);
    });
  
  }
  
  async function getContactsList() {
    if (!localStorage.getItem('accessToken')) {
        return;
    }
    const body = {
        limit: 0,
        page: 0,
        exclude_hosts: 0
    };
  
    try {
        const response = await ApiServices.contactsList(localStorage.getItem('accessToken') || '', body);
        localStorage.setItem("contacts", JSON.stringify(response.contacts))
        response?.contacts?.forEach((contact) => {
          const option = document.createElement('option');
          const optionText = document.createTextNode(contact.first_name + " (" + contact.email + ") ");
          option.appendChild(optionText);
          option.setAttribute('value',contact.id);
          option.setAttribute('name', contact.id);
          option.setAttribute('class', 'participant text-gray-700 block px-4 py-2 text-sm cursor-pointer');
          const participantsDropdown = document.querySelector('#mySelectParticipants');
          participantsDropdown.appendChild(option);
        })
        response.contacts.forEach((contact) => {
          const option = document.createElement('option');
          const optionText = document.createTextNode(contact.first_name + " (" + contact.email + ") ");
          option.appendChild(optionText);
          option.setAttribute('value',contact.id);
          option.setAttribute('name', contact.id);
          option.setAttribute('class', 'participant text-gray-700 block px-4 py-2 text-sm cursor-pointer');
          const moderatorsDropdown = document.querySelector('#mySelectModerators');
          moderatorsDropdown.appendChild(option);
        })
    } catch (error) {
        console.log(error);
    }
  }
  
  const addParticipant = (event) => {
    const user = JSON.parse(localStorage.getItem("contacts")).filter((contact) => {
      return contact.id === parseInt(event.target.value);
    })
    const attendParticipants = JSON.parse(localStorage.getItem("attendees")) || [];
    if (attendParticipants.includes(event.target.value) === false) {
        attendParticipants.push(event.target.value);
        localStorage.setItem("attendees", JSON.stringify(attendParticipants))
        const newTag = document.createElement('div');
        const pTag = document.createElement('p');
        const button = document.createElement('button')
        button.setAttribute('id', user[0]?.id)
        button.setAttribute('class', 'w-28 text-slate-600 border rounded-md')
        button.setAttribute('type', 'button')
        button.setAttribute('onclick', "removeParticipant(event)")
        const buttonText = document.createTextNode("Remove")
        button.appendChild(buttonText)
        const tagText = document.createTextNode(user[0]?.first_name);
        pTag.appendChild(tagText);
        newTag.appendChild(pTag)
        newTag.appendChild(button);
        newTag.setAttribute('id', "participant-" +user[0]?.id);
        newTag.setAttribute('class', 'w-96 flex justify-between')
        const newTagParent = document.querySelector('#participants-display'); 
        newTagParent.appendChild(newTag);
    }
  };

  const removeParticipant = (event) => {
    let existing = JSON.parse(localStorage.getItem("attendees")) || [];
    existing.splice(
    existing.indexOf(event.target.id),
    existing.indexOf(event.target.id) + 1
    );
    const element = document.querySelector(`#participant-${event.target.id}`);
    element.remove()
    localStorage.setItem("attendees", JSON.stringify(existing))
  };

  const addModerator = (event) => {
    const user = JSON.parse(localStorage.getItem("contacts")).filter((contact) => {
      return contact.id === parseInt(event.target.value);
    })
    const attendModerators = JSON.parse(localStorage.getItem("hostusers")) || [];
    if (attendModerators.includes(event.target.value) === false) {
        attendModerators.push(event.target.value);
        
        localStorage.setItem("hostusers", JSON.stringify(attendModerators))
        const newTag = document.createElement('div');
        const pTag = document.createElement('p');
        const button = document.createElement('button');
        button.setAttribute('id', user[0]?.id);
        button.setAttribute('class', 'w-28 text-slate-600 border rounded-md');
        button.setAttribute('type', 'button');
        button.setAttribute('onclick', "removeModerator(event)");
        const buttonText = document.createTextNode("Remove");
        button.appendChild(buttonText);
        const tagText = document.createTextNode(user[0]?.first_name);
        pTag.appendChild(tagText);
        newTag.appendChild(pTag)
        newTag.appendChild(button);
        newTag.setAttribute('id', "moderator-" + user[0]?.id);
        newTag.setAttribute('class', 'w-96 flex justify-between')
        const newTagParent = document.querySelector('#moderators-display'); 
        newTagParent.appendChild(newTag);
    }
  };

  const removeModerator = (event) => {
    let existing = JSON.parse(localStorage.getItem("hostusers")) || [];
    existing.splice(
    existing.indexOf(event.target.id),
    existing.indexOf(event.target.id) + 1
    );
    const element = document.querySelector(`#moderator-${event.target.id}`);
    element.remove()
    localStorage.setItem("hostusers", JSON.stringify(existing))
  };

  async function scheduleMeeting(event) {
    event.preventDefault()
    const [time, meridiem] = timeConvert(document.forms["form"]["meeting_time"].value)
    const body = {
      meeting_name: document.forms["form"]["meeting_name"].value,
      passcode: document.forms["form"]["passcode"].value,
      meeting_date: document.forms["form"]["meeting_date"].value.split('-').reverse().join('-'),
      meeting_time: time,
      meeting_meridiem: meridiem,
      timezone: document.forms["form"]["timezone"].value,
      attend: JSON.parse(localStorage.getItem("attendees")),
      hostusers: JSON.parse(localStorage.getItem("hostusers")),
      options: [document.forms["form"]["options"].value]
  }
  const loader = document.createElement("div")
                loader.setAttribute("class", "loader")
                document.querySelector("#manual-meeting-loader").appendChild(loader)
    try {
      const response = await ApiServices.scheduleMeeting(
        localStorage.getItem("accessToken") || "",
        body
      );
  
      if (response.success) {
          $("#modal").append(`<div>
          <div class="relative z-10" id="headlessui-dialog-5" role="dialog" aria-modal="true"
              data-headlessui-state="open">
              <div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity opacity-100"></div>
              <div class="fixed inset-0 z-10 overflow-y-auto">
                  <div class="flex justify-end">
                      <button id="close-modal" onclick="removeModal()">Close</button>
                  </div>
                  <div
                      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-100 translate-y-0 sm:scale-100"
                          id="headlessui-dialog-panel-6" data-headlessui-state="open">
                          <div class="p-8 grid gap-2">
                              <div
                                  class="h-14 flex justify-center items-center w-full rounded-lg bg-green-100 text-green-600">
                                  Your meeting has been created successfully!</div>
                              <div class="font-semibold text-gray-600">Meeting id: <span
                                      class="font-normal text-gray-700">${response.data.meeting_id}</span>
                              </div>
                              <div class="font-semibold text-gray-600">Meeting passcode: <span
                                      class="font-normal text-gray-700">${response.data.passcode}</span>
                              </div>
                              <div class="font-semibold text-gray-600">Meeting URL: <span
                                      class="font-normal text-gray-700">${response.data.joinURL}</span>
                              </div>
                              <div class="flex justify-center"><a href="join-meeting.html?meeting_id=${response.data.meeting_id}&pcode=${response.data.pcode}"
                                      tabindex="0"><button
                                          class="bg-emerald-600 font-semibold px-4 py-2 mt-1 text-white rounded-md">Start
                                          Meeting</button></a></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`)
      return
      }
        throw "error"
    } catch (error) {
      const displayError = document.createElement("div")
                    displayError.setAttribute("class", "flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600")
                    const errorParagraph = document.createElement("p")
                    const errorText = document.createTextNode("Something went wrong! Please inspect and try to find the error in the network tab.")
                    errorParagraph.appendChild(errorText)
                    displayError.appendChild(errorParagraph)
                    document.querySelector("#error").appendChild(displayError)
                    setTimeout(() => {
                        document.querySelector("#error").remove( )
                    }, 3000)
      console.log(error);
    } finally {
      document.querySelector(".loader").remove()
    }
  };
