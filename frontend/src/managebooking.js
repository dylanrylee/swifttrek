const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const events = {};  // Store events in an object { "YYYY-MM-DD": ["event1", "event2"] }

// Populate month and year selectors
function populateSelectors() {
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    // Populate month options
    months.forEach((month, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = month;
        if (index === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    });

    // Populate year options
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
}

// function renderCalendar(month, year) {
//     calendar.innerHTML = "";

//     // Create container for weekday headers
//     const weekRow = document.createElement("div");
//     weekRow.classList.add("week-row");
//     const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     weekDays.forEach(day => {
//         const dayHeader = document.createElement("div");
//         dayHeader.classList.add("week-day");
//         dayHeader.textContent = day;
//         weekRow.appendChild(dayHeader);
//     });
//     calendar.appendChild(weekRow);

//     // Create container for day cells
//     const daysGrid = document.createElement("div");
//     daysGrid.classList.add("days-grid");

//     const firstDay = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     monthYear.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

//     // Empty cells for days before the first day of the month
//     for (let i = 0; i < firstDay; i++) {
//         const emptyDiv = document.createElement("div");
//         emptyDiv.classList.add("empty");
//         daysGrid.appendChild(emptyDiv);
//     }

//     // Render the days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//         const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//         const dayDiv = document.createElement("div");
//         dayDiv.classList.add("day");
//         dayDiv.innerHTML = `<strong>${day}</strong>`;

//         // Highlight today's date
//         if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
//             dayDiv.classList.add("today");
//         }

//         // Add any events
//         if (events[dateStr]) {
//             events[dateStr].forEach(event => {
//                 const eventDiv = document.createElement("div");
//                 eventDiv.classList.add("event");
//                 eventDiv.textContent = event;
//                 dayDiv.appendChild(eventDiv);
//             });
//         }

//         dayDiv.onclick = () => addEvent(dateStr);
//         daysGrid.appendChild(dayDiv);
//     }
    
//     calendar.appendChild(daysGrid);
// }

function renderCalendar(month, year) {
    calendar.innerHTML = "";

    // Create container for day cells
    const daysGrid = document.createElement("div");
    daysGrid.classList.add("days-grid");

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    monthYear.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty");
        daysGrid.appendChild(emptyDiv);
    }

    // Render the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        // Get the day of the week for this date
        const dayOfWeek = new Date(year, month, day).getDay(); // 0 = Sun, 1 = Mon, ...
        const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek];

        // Set innerHTML to display the day name and the date
        dayDiv.innerHTML = `<strong>${dayName} ${day}</strong>`;

        // Highlight today's date
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayDiv.classList.add("today");
        }

        // Add any events
        if (events[dateStr]) {
            events[dateStr].forEach(event => {
                const eventDiv = document.createElement("div");
                eventDiv.classList.add("event");
                eventDiv.textContent = event;
                dayDiv.appendChild(eventDiv);
            });
        }

        dayDiv.onclick = () => addEvent(dateStr);
        daysGrid.appendChild(dayDiv);
    }
    
    calendar.appendChild(daysGrid);
}


function addEvent(dateStr) {
    const eventText = prompt("Enter event:");
    if (eventText) {
        if (!events[dateStr]) events[dateStr] = [];
        events[dateStr].push(eventText);
        renderCalendar(currentMonth, currentYear);
    }
}

// Event handlers for month/year selection
monthSelect.addEventListener("change", (e) => {
    currentMonth = parseInt(e.target.value);
    renderCalendar(currentMonth, currentYear);
});

yearSelect.addEventListener("change", (e) => {
    currentYear = parseInt(e.target.value);
    renderCalendar(currentMonth, currentYear);
});

// Navigate back to the current date
function goToToday() {
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    monthSelect.selectedIndex = currentMonth;
    yearSelect.value = currentYear;
    renderCalendar(currentMonth, currentYear);
}

// Initialize calendar and selectors
populateSelectors();
renderCalendar(currentMonth, currentYear);
