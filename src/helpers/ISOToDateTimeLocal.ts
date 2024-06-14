export default function ISOToDateTimeLocal(inputDate: any) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding leading zero if month is single digit
  const day = ("0" + date.getDate()).slice(-2); // Adding leading zero if day is single digit
  const hours = ("0" + date.getHours()).slice(-2); // Adding leading zero if hours is single digit
  const minutes = ("0" + date.getMinutes()).slice(-2); // Adding leading zero if minutes is single digit
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  return formattedDate;
}
