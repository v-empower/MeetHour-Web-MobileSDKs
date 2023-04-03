function timeConvert(time) {
    time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
        time = time.slice(1);
        time[5] = Number(time[0]) < 12 ? " AM" : " PM";
        time[0] = Number(time[0]) % 12 || 12;
        if (time[0] < 10) {
            time[0] = `0${Number(time[0]) % 12}` || 12;
        }
    }

    return time.join("").split(" ");
}

async function getContactsList(contacts) {
    try {
        const response = contacts;
        localStorage.setItem("contacts", JSON.stringify(response.contacts));
        response?.contacts?.forEach((contact) => {
            const option = document.createElement("option");
            const optionText = document.createTextNode(
                contact.first_name + " (" + contact.email + ") "
            );
            option.appendChild(optionText);
            option.setAttribute("value", contact.id);
            option.setAttribute("name", contact.id);
            option.setAttribute(
                "class",
                "participant text-gray-700 block px-4 py-2 text-sm cursor-pointer"
            );
            const participantsDropdown = document.querySelector(
                "#mySelectParticipants"
            );
            participantsDropdown.appendChild(option);
        });
        response.contacts.forEach((contact) => {
            const option = document.createElement("option");
            const optionText = document.createTextNode(
                contact.first_name + " (" + contact.email + ") "
            );
            option.appendChild(optionText);
            option.setAttribute("value", contact.id);
            option.setAttribute("name", contact.id);
            option.setAttribute(
                "class",
                "participant text-gray-700 block px-4 py-2 text-sm cursor-pointer"
            );
            const moderatorsDropdown = document.querySelector(
                "#mySelectModerators"
            );
            moderatorsDropdown.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

const addParticipant = (event) => {
    const user = JSON.parse(localStorage.getItem("contacts")).filter(
        (contact) => {
            return contact.id === parseInt(event?.target?.value);
        }
    );
    const attendParticipants =
        JSON.parse(localStorage.getItem("attendees")) || [];
    if (attendParticipants.includes(event.target.value) === false) {
        attendParticipants.push(event.target.value);
        localStorage.setItem("attendees", JSON.stringify(attendParticipants));
        const newTag = document.createElement("div");
        const pTag = document.createElement("p");
        const button = document.createElement("button");
        button.setAttribute("id", user[0]?.id);
        button.setAttribute("class", "w-28 text-slate-600 border rounded-md");
        button.setAttribute("type", "button");
        button.setAttribute("onclick", "removeParticipant(event)");
        const buttonText = document.createTextNode("Remove");
        button.appendChild(buttonText);
        const tagText = document.createTextNode(user[0]?.first_name);
        pTag.appendChild(tagText);
        newTag.appendChild(pTag);
        newTag.appendChild(button);
        newTag.setAttribute("id", "participant-" + user[0]?.id);
        newTag.setAttribute("class", "w-96 flex justify-between");
        const newTagParent = document.querySelector("#participants-display");
        newTagParent.appendChild(newTag);
        console.log(attendParticipants);
        document.getElementById("attendArray").value =
            JSON.stringify(attendParticipants);
    }
};

const removeParticipant = (event) => {
    let existing = JSON.parse(localStorage.getItem("attendees")) || [];
    existing.splice(
        existing.indexOf(event.target.id),
        existing.indexOf(event.target.id) + 1
    );
    const element = document.querySelector(`#participant-${event.target.id}`);
    element.remove();
    localStorage.setItem("attendees", JSON.stringify(existing));
    document.getElementById("attendArray").value = JSON.stringify(
        localStorage.getItem("attendees")
    );
};

const addModerator = (event) => {
    const user = JSON.parse(localStorage.getItem("contacts")).filter(
        (contact) => {
            return contact.id === parseInt(event.target.value);
        }
    );
    const attendModerators =
        JSON.parse(localStorage.getItem("hostusers")) || [];
    if (attendModerators.includes(event.target.value) === false) {
        attendModerators.push(event.target.value);
        localStorage.setItem("hostusers", JSON.stringify(attendModerators));
        const newTag = document.createElement("div");
        const pTag = document.createElement("p");
        const button = document.createElement("button");
        button.setAttribute("id", user[0]?.id);
        button.setAttribute("class", "w-28 text-slate-600 border rounded-md");
        button.setAttribute("type", "button");
        button.setAttribute("onclick", "removeModerator(event)");
        const buttonText = document.createTextNode("Remove");
        button.appendChild(buttonText);
        const tagText = document.createTextNode(user[0]?.first_name);
        pTag.appendChild(tagText);
        newTag.appendChild(pTag);
        newTag.appendChild(button);
        newTag.setAttribute("id", "moderator-" + user[0]?.id);
        newTag.setAttribute("class", "w-96 flex justify-between");
        const newTagParent = document.querySelector("#moderators-display");
        newTagParent.appendChild(newTag);
        document.getElementById("hostusersArray").value =
            JSON.stringify(attendModerators);
    }
};

const removeModerator = (event) => {
    let existing = JSON.parse(localStorage.getItem("hostusers")) || [];
    existing.splice(
        existing.indexOf(event.target.id),
        existing.indexOf(event.target.id) + 1
    );
    const element = document.querySelector(`#moderator-${event.target.id}`);
    element.remove();
    localStorage.setItem("hostusers", JSON.stringify(existing));
    document.getElementById("hostusersArray").value = JSON.stringify(
        localStorage.getItem("hostusers")
    );
};
