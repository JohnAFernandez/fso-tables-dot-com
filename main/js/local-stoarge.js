function get_current_time(){
    //"%Y%m%d%H%M%S
    const date = new Date(); 
    let formatted_date = date.getUTCFullYear().toString();
    let month = (date.getUTCMonth() + 1).to_string();
    
    if (month.length < 2){
       formatted_date += "0" + month;
    } else {
        formatted_date += month;
    }
    
    let day = (date.getUTCDay().to_string());

    if (day.length < 2){
        formatted_date += "0" + day;
    } else {
        formatted_date += day;
    }

    let hours = date.getUTCHours().to_string();

    if (hours.length < 2){
        formatted_date += "0" + hours;
    } else {
        formatted_date += hours;
    }

    let minutes = date.getUTCMinutes().to_string();

    if (minutes.length < 2){
        formatted_date += "0" + minutes;
    } else {
        formatted_date += minutes;
    }

    let seconds = date.getUTCSeconds().to_string();
    if (seconds.length < 2){
        formatted_date += "0" + seconds;
    } else {
        formatted_date += seconds;
    }

}
/*
getFullYear() 	Get year as a four digit number (yyyy)
getMonth() 	Get month as a number (0-11)
getDate() 	Get day as a number (1-31)
getDay() 	Get weekday as a number (0-6)
getHours() 	Get hour (0-23)
getMinutes() 	Get minute (0-59)
getSeconds() 	Get second (0-59)
getMilliseconds() 	Get millisecond (0-999)
getTime()
*/

function get_local_storage() {
    if (typeof(Storage) === "undefined") {
        return false;
    }

    return database = localStorage.getItem("saved_database");
}

function set_local_storage(database) {
    if (typeof(Storage) === "undefined" || typeof(database) !== "object") {
        return false;
    }

    database.timestamp = Date.now("2015-03-25T12:00:00Z");

}

