export default function roundUpToHour(date = new Date()) {
  const dateCopy = new Date(date);
  let threshold = 1;
  // if (dateCopy.getMinutes() <= 40) {
  //   threshold += 1;
  // };

  dateCopy.setHours(dateCopy.getHours() + threshold);
  const hours = String(dateCopy.getHours()).padStart(2, '0');
  return hours + '00';
};
