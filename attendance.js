let checkInTime = null;
let checkOutTime = null;

const checkinBtn = document.getElementById('checkin-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const statusEl = document.getElementById('status');
const workingHoursEl = document.getElementById('working-hours');

checkinBtn.addEventListener('click', () => {
  checkInTime = new Date();
  statusEl.textContent = `Checked in at ${checkInTime.toLocaleTimeString()}`;
  checkinBtn.disabled = true;
  checkoutBtn.disabled = false;

  // Save check-in in Firestore
  firebase.firestore().collection("attendance").add({
    uid: firebase.auth().currentUser.uid,
    checkIn: firebase.firestore.Timestamp.fromDate(checkInTime),
    date: new Date().toDateString(),
  });
});

checkoutBtn.addEventListener('click', async () => {
  checkOutTime = new Date();
  const hoursWorked = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);
  workingHoursEl.textContent = `You worked ${hoursWorked} hours today.`;
  statusEl.textContent = `Checked out at ${checkOutTime.toLocaleTimeString()}`;

  // Update last attendance entry for today
  const uid = firebase.auth().currentUser.uid;
  const today = new Date().toDateString();

  const snapshot = await firebase.firestore().collection("attendance")
    .where("uid", "==", uid)
    .where("date", "==", today)
    .orderBy("checkIn", "desc")
    .limit(1)
    .get();

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    await doc.ref.update({
      checkOut: firebase.firestore.Timestamp.fromDate(checkOutTime),
      hoursWorked: parseFloat(hoursWorked)
    });
  }

  checkoutBtn.disabled = true;
});
