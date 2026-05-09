const bookingForm = document.querySelector("#bookingForm");
const formStatus = document.querySelector("#formStatus");
const travelDate = document.querySelector("#travelDate");
const year = document.querySelector("#year");

function toDateInputValue(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function addMonths(date, months) {
  const result = new Date(date);
  const day = result.getDate();
  result.setMonth(result.getMonth() + months);

  if (result.getDate() !== day) {
    result.setDate(0);
  }

  return result;
}

function setBookingWindow() {
  const today = new Date();
  const maxDate = addMonths(today, 6);

  travelDate.min = toDateInputValue(today);
  travelDate.max = toDateInputValue(maxDate);
}

function setStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

function clearInvalidState() {
  bookingForm
    .querySelectorAll(".invalid")
    .forEach((field) => field.classList.remove("invalid"));
}

function markInvalidFields() {
  const fields = bookingForm.querySelectorAll("input, select, textarea");

  fields.forEach((field) => {
    if (!field.checkValidity()) {
      field.classList.add("invalid");
    }
  });

  const returnSelected = bookingForm.querySelector("[name='returnJourney']:checked");
  const returnFieldset = bookingForm.querySelector("fieldset");

  if (!returnSelected) {
    returnFieldset.classList.add("invalid");
  }
}

bookingForm.addEventListener("input", (event) => {
  event.target.classList.remove("invalid");

  if (event.target.name === "returnJourney") {
    bookingForm.querySelector("fieldset").classList.remove("invalid");
  }
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearInvalidState();

  if (!bookingForm.checkValidity()) {
    markInvalidFields();
    setStatus("Please complete the required booking details before sending.", "error");
    return;
  }

  const formData = new FormData(bookingForm);
  const bookingRequest = Object.fromEntries(formData.entries());
  localStorage.setItem("lvpTravelLatestRequest", JSON.stringify(bookingRequest));

  bookingForm.reset();
  setBookingWindow();
  setStatus(
    "Thank you. Your booking request has been prepared and LVP Travel will confirm availability and price.",
    "success"
  );
});

year.textContent = new Date().getFullYear();
setBookingWindow();
