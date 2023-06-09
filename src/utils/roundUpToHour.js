export default function roundUpToHour(date = new Date()) {
  date.setHours(date.getHours() + 1);
  const hours = String(date.getHours()).padStart(2, '0');
  return hours + '00';
};
