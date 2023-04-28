export default function formatDate(newDate: Date) {
  // const newDate = new Date(date);
  return `${newDate.getFullYear()}/${
    newDate.getMonth() + 1
  }/${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}`;
}
