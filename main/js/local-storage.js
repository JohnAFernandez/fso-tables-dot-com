const Database_Handle = "saved_database";

function get_current_time(){
    //This datatbase uses so this is the easiest to do direct comparisons with "%Y%m%d%H%M%S
    const date = new Date(); 
    let formatted_date = date.getUTCFullYear().toString();
    let month = (date.getUTCMonth() + 1).toString();

    if (month.length < 2){
       formatted_date += "0" + month;
    } else {
        formatted_date += month;
    }
    
    let day = (date.getUTCDate().toString());

    if (day.length < 2){
        formatted_date += "0" + day;
    } else {
        formatted_date += day;
    }

    let hours = date.getUTCHours().toString();

    if (hours.length < 2){
        formatted_date += "0" + hours;
    } else {
        formatted_date += hours;
    }

    let minutes = date.getUTCMinutes().toString();

    if (minutes.length < 2){
        formatted_date += "0" + minutes;
    } else {
        formatted_date += minutes;
    }

    let seconds = date.getUTCSeconds().toString();
    if (seconds.length < 2){
        formatted_date += "0" + seconds;
    } else {
        formatted_date += seconds;
    }

    return formatted_date;
}


function get_local_storage() {
    if (typeof(Storage) === "undefined") {
        return false;
    }

    try {
        let database = localStorage.getItem(Database_Handle);
        return JSON.parse(database);
    } catch {
        return null;
    }
}

function set_local_storage(database) {
    if (typeof(Storage) === "undefined" || typeof(database) !== "object") {
        return false;
    }

    try{
        Storage.set(Database_Handle, JSON.stringify(database));
    } catch {
        console.log("Setting local storage failed");
        return false
    }

    return true;    
}

