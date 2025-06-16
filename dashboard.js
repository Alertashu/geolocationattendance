// dashboard.js
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("user-name").textContent = user.displayName || "User";
    document.getElementById("user-email").textContent = user.email;
    initMap();
    loadAttendanceHistory(user.uid);
  } else {
    window.location.href = "index.html";
  }
});

// Logout
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", function() {
  firebase.auth().signOut();
});

let map, userMarker;
function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 16
      });
      userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "You are here"
      });
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Attendance Functions
const checkinBtn = document.getElementById("checkin-btn");
const checkoutBtn = document.getElementById("checkout-btn");

checkinBtn.addEventListener("click", () => markAttendance("checkin"));
checkoutBtn.addEventListener("click", () => markAttendance("checkout"));

function markAttendance(type) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().split(" ")[0];
  const docRef = firebase.firestore().collection("attendance").doc(user.uid);

  docRef.get().then(doc => {
    let data = doc.exists ? doc.data() : {};
    if (!data[dateStr]) data[dateStr] = {};
    data[dateStr][type] = timeStr;

    docRef.set(data).then(() => {
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} marked at ${timeStr}`);
      loadAttendanceHistory(user.uid);
    });
  });
}

function loadAttendanceHistory(uid) {
  const tableBody = document.getElementById("history-table");
  tableBody.innerHTML = "";
  const docRef = firebase.firestore().collection("attendance").doc(uid);

  docRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      Object.keys(data).reverse().slice(0, 5).forEach(date => {
        const entry = data[date];
        const tr = document.createElement("tr");
        const duration = calculateDuration(entry.checkin, entry.checkout);
        tr.innerHTML = `
          <td>${date}</td>
          <td>${entry.checkin || "-"}</td>
          <td>${entry.checkout || "-"}</td>
          <td>${duration}</td>
        `;
        tableBody.appendChild(tr);
      });
    }
  });
}

function calculateDuration(start, end) {
  if (!start || !end) return "-";
  const startTime = new Date(`1970-01-01T${start}Z`);
  const endTime = new Date(`1970-01-01T${end}Z`);
  const diffMs = endTime - startTime;
  const hours = Math.floor(diffMs / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

function pad(n) {
  return n < 10 ? "0" + n : n;
}
// dashboard.js

// Sample Pie Chart Data
const chartConfigs = [
  {
    id: 'presentChart',
    label: 'Present',
    data: [30, 70],
    colors: ['#4caf50', '#e0e0e0']
  },
  {
    id: 'absentChart',
    label: 'Absent',
    data: [30, 70],
    colors: ['#f44336', '#e0e0e0']
  },
  {
    id: 'ontimeChart',
    label: 'On Time',
    data: [22, 8],
    colors: ['#2196f3', '#e0e0e0']
  },
  {
    id: 'lateChart',
    label: 'Late',
    data: [8, 22],
    colors: ['#ff9800', '#e0e0e0']
  },
];

const deptCharts = [
  {
    id: 'deptChart1',
    label: 'Production & Delivery',
    data: [10, 5, 5, 8, 2],
    labels: ['Late', 'On Leave', 'Absent', 'On Time', 'Holiday'],
    colors: ['#ff9800', '#4caf50', '#f44336', '#2196f3', '#9e9e9e']
  },
  {
    id: 'deptChart2',
    label: 'R&D',
    data: [5, 5, 5, 10, 5],
    labels: ['Late', 'On Leave', 'Absent', 'On Time', 'Holiday'],
    colors: ['#ff9800', '#4caf50', '#f44336', '#2196f3', '#9e9e9e']
  },
  {
    id: 'deptChart3',
    label: 'Business & Strategy',
    data: [6, 4, 10, 5, 5],
    labels: ['Late', 'On Leave', 'Absent', 'On Time', 'Holiday'],
    colors: ['#ff9800', '#4caf50', '#f44336', '#2196f3', '#9e9e9e']
  },
];

function createPieChart(id, label, data, colors) {
  new Chart(document.getElementById(id), {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        label,
        data,
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      cutout: '70%'
    }
  });
}

function createDepartmentChart(id, labels, data, colors) {
  new Chart(document.getElementById(id), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
      },
      cutout: '50%'
    }
  });
}


// Initialize main cards
chartConfigs.forEach(config => {
  createPieChart(config.id, config.label, config.data, config.colors);
});

// Initialize department charts
deptCharts.forEach(chart => {
  createDepartmentChart(chart.id, chart.labels, chart.data, chart.colors);
});
