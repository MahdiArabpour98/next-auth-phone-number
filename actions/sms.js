"use server";

import Kavenegar from "kavenegar";
const kavenegar = Kavenegar.KavenegarApi({
  apikey:
    "4B3753736B302F66445946546344476D4C456E72684B615667462B642B717372727A69326F65522F6D48673D",
});

export async function OTP(phoneNumber, randomCode) {
  console.log("kaveh phoneNumber", phoneNumber, "kaveh randomCode", randomCode);
  return new Promise((resolve, reject) => {
    kavenegar.VerifyLookup(
      {
        receptor: phoneNumber,
        token: randomCode,
        template: "verify",
      },
      (response, status, message) => {
        // you can also reject here based on the status.
        console.log("kaveh", response, status, message);
        resolve({ response, status, message });
      }
    );
  });
}
