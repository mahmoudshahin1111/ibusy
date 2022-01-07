const ibusyObj = new ibusy.IBusy();
let periods = [];
const timesTable = document.getElementById("timesTable");
const filterAllowedPeriodsTable = document.getElementById("filterAllowedPeriodsTable");

const errorsContainer = document.getElementById("errorsContainer");
const addNewPeriodForm = document.getElementById("addNewPeriodForm");
addNewPeriodForm.addEventListener("submit", onAddNewPeriodSubmitted);
const filterAllowedPeriodsButton = document.getElementById("filterAllowedPeriods");
filterAllowedPeriodsButton.addEventListener("click", () => onFilterAllowedPeriodsClicked());

function onAddNewPeriodSubmitted(e) {
  e.preventDefault();
  const startTime = addNewPeriodForm.querySelector("[name=startTime]").value;
  const endTime = addNewPeriodForm.querySelector("[name=endTime]").value;
  const isAllowedPeriod = addNewPeriodForm.querySelector("[name=isAllowedPeriod]").checked;
  resetErrors();
  if (!validateDate(startTime)) {
    displayErrors(["start time invalid"]);
    return;
  }
  if (!validateDate(endTime)) {
    displayErrors(["end time invalid"]);
    return;
  }
  if (!validateIsEndDateAfterStartDate(startTime, endTime)) {
    displayErrors(["start time should be before end time"]);
    return;
  }
  periods.push({
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    isAllowedPeriod
  });
  enableFilter();
  rerender();
}

function disableFilter(){
  filterAllowedPeriodsButton.setAttribute('disabled',true);
}
function enableFilter(){
  filterAllowedPeriodsButton.removeAttribute('disabled');
}
function rerender() {
  timesTable.querySelector("tbody").innerHTML = "";
  periods.forEach((period) => {
    const periodTrElement = document.createElement("tr");
    const startTimeTdElement = document.createElement("td");
    startTimeTdElement.innerText = period.startTime;
    periodTrElement.appendChild(startTimeTdElement);
    const endTimeTdElement = document.createElement("td");
    endTimeTdElement.innerText = period.endTime;
    periodTrElement.appendChild(endTimeTdElement);

    const isAllowedPeriodTdElement = document.createElement("td");
    isAllowedPeriodTdElement.innerText = period.isAllowedPeriod ? "Yes" : "No";
    periodTrElement.appendChild(isAllowedPeriodTdElement);
    const actionTdElement = document.createElement("td");
    actionTdElement.appendChild(createRemovePeriodButton(period));
    periodTrElement.appendChild(actionTdElement);
    timesTable.querySelector("tbody").appendChild(periodTrElement);
  });
}
function createRemovePeriodButton(period) {
  const removeButtonElement = document.createElement("button");
  removeButtonElement.innerText = "Remove";
  removeButtonElement.addEventListener("click", (e) => onRemovePeriodClicked(e, period));
  return removeButtonElement;
}
function onRemovePeriodClicked(e, period) {
  periods = periods.filter((_period) => _period !== period);
  if(!periods.length) disableFilter();
  rerender();
}

function validateDate(date) {
  return date !== null && date !== undefined && date !== "";
}

function validateIsEndDateAfterStartDate(startDate, endDate) {
  return new Date(startDate).getTime() < new Date(endDate).getTime();
}
function displayErrors(messages) {
  errorsContainer.innerHTML = "";
  messages.forEach((message) => {
    const errorLiElement = document.createElement("li");
    errorLiElement.innerText = message;
    errorsContainer.appendChild(errorLiElement);
  });
}
function resetErrors() {
  errorsContainer.innerHTML = "";
}

function onFilterAllowedPeriodsClicked() {
  const transformedAllowedPeriods = [];
  const transformedDisallowedPeriods = [];
  periods.forEach((period) => {
    if (period.isAllowedPeriod) {
      transformedAllowedPeriods.push({ start: period.startTime, end: period.endTime });
    } else {
      transformedDisallowedPeriods.push({ start: period.startTime, end: period.endTime });
    }
  });
  const filteredAllowedPeriods = ibusyObj.getAllowedPeriodsBetween(transformedAllowedPeriods,transformedDisallowedPeriods);
  filterAllowedPeriodsTable.querySelector("tbody").innerHTML = "";
  filteredAllowedPeriods.forEach((period) => {
    const periodTrElement = document.createElement("tr");
    const startTimeTdElement = document.createElement("td");
    startTimeTdElement.innerText = period.start;
    periodTrElement.appendChild(startTimeTdElement);
    const endTimeTdElement = document.createElement("td");
    endTimeTdElement.innerText = period.end;
    periodTrElement.appendChild(endTimeTdElement);
    filterAllowedPeriodsTable.querySelector("tbody").appendChild(periodTrElement);
  });
  rerender();
}
