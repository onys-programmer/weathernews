import toYYYYMMDD from "../utils/toYYYYMMDD";

export const SERVICE_KEY = 'Wt3SOL1qym0ad0vNxHFdNc%2BkA5CwBNj8y1ERFTOkaMIAfu%2BvCg1CpZZ5Rv5IH2mDunhjFJ6kJBT6%2FHQM5rFo2Q%3D%3D';
// BASE_DATE: YYYYMMDD format of today of our country
export const today = new Date();
export const yesterday = new Date(today - 86400000);
// console.log(today, yesterday, 'today, yesterday')
export const BASE_DATE = toYYYYMMDD(today);
export const YESTERDAY_DATE = toYYYYMMDD(yesterday);

