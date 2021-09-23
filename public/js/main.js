let calenderObject = document.getElementById("days");
let timeObject = document.getElementById("times");
let dateInfo = document.getElementById("dateInfo");

let dateInput = document.getElementById("dateInput");
let timeInput = document.getElementById("timeInput");

let months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
let toAddMonth = 0;
let toAddYear = 0;

let selectedMonth;
let selectedTime;

let closed = [0, 6]

let grasePeriod = 5;
let timePeriod = 15;
let startH = 9;
let startM = 00;
let endH = 15;
let endM = 00;
let timeList = [];

function makeTimeList(startH, startM, endH, endM, grasePeriod, timePeriod)
{
    d = new Date();
    d.setHours(startH);
    d.setMinutes(startM);
    timeList = [];
    while (d.getHours() < endH)
    {
        if (d.getHours() < 10)
        {
            if (d.getMinutes() < 10)
            {
                timeList.push(`0${d.getHours()}:0${d.getMinutes()}`);
            } else
            {
                timeList.push(`0${d.getHours()}:${d.getMinutes()}`);
            }
            d.setMinutes(d.getMinutes() + timePeriod);

        } else
        {
            if (d.getMinutes() < 10) {
                timeList.push(d.getHours() + ": 0" + d.getMinutes());
            } else
            {
                timeList.push(d.getHours() + ":" + d.getMinutes());
            }
        d.setMinutes(d.getMinutes() + timePeriod);

        }
    }
}
makeTimeList(startH, startM, endH, endM, grasePeriod, timePeriod);

for (time of timeList)
{
    timeObject.innerHTML += `<li class="timeItem" onclick="makeSelectedTime(this)">${time}</li>`;
}

getDaysOfMonth(month, year);

function getDaysOfMonth(month, year)
{
    calenderObject.innerHTML = "";
    dateInfo.innerHTML = "";
    date = new Date(year, month, 1);
    var days = [];
    let weekDay = 1;
    dateInfo.innerHTML = `${months[month]}<br><span style="font-size: 18px">${year}</span>`;
    while (date.getMonth() == month)
    {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    while (weekDay < days[0].getDay())
    {
        calenderObject.innerHTML += "<li> </li>";
        weekDay++;
    }
    for (day of days)
    {

        calenderObject.innerHTML += "<li class='open' onclick='makeSelected(this)'>" + day.getDate() + "</li>";
        weekDay = 1;
        if(closed.includes(day.getDay()) || day < new Date())
        {
            calenderObject.lastChild.classList.remove("open");
            calenderObject.lastChild.classList.add("closed");
            calenderObject.lastChild.removeAttribute("onclick");
        }

    }
}

function getNextMonth()
{
    if (month <= 10)
    {
        month++;
        toAddMonth++;

        getDaysOfMonth(month, year)
    } else
    {
        date = new Date(year + 1, 0, 1);
        year = date.getFullYear();
        month = 0;
        toAddYear = 1;
        getDaysOfMonth(0, year);
    }
    
}

function getPrevMonth()
{
    
    if (1 <= month)
    {
        month--;
        getDaysOfMonth(month, year)
    } else
    {
        date = new Date(year - 1, 11, 1);
        year = date.getFullYear();
        month = 11;
        getDaysOfMonth(11, year);
    }

}

function makeSelected(element)
{
    if (selectedMonth != element && selectedMonth != undefined)
    {
        selectedMonth.classList.remove("selected");
    }
    selectedMonth = element;
    dateInput.value = `${date.getFullYear()}-${date.getMonth()}-${element.innerHTML}`;
    element.classList.add("selected");
    
}

function makeSelectedTime(element)
{  
    if (selectedTime != element && selectedTime != undefined)
    {
        selectedTime.classList.remove("selected");
    }
    selectedTime = element;
    timeInput.value = element.innerHTML;
    element.classList.add("selected");
}