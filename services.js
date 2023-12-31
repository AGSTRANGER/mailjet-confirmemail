const axios = require("axios");
const helpers = require("./helpers");

require("dotenv").config();

// Mailjet API credentials
const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;

// Mailjet list ID

const { LIST_ID } = process.env;

// Step 1: Contact's subscription
const subscribeUser = async (email, firstName, lastName) => {
  // Step 2: Creation of the customized confirmation link
  const MD5hash = helpers.generateMD5Hash(email);
  // Determine the base URL based on the environment
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "http://ummanite.com"
      : "http://localhost:3000";

  // Create the confirmation link using the base URL
  const confirmationLink = `${baseUrl}/confirm?email=${email}&md5hash=${MD5hash}`;

  // Step 3: Sending of the confirmation email
  await helpers.sendConfirmationEmail(
    email,
    firstName,
    lastName,
    confirmationLink,
    MD5hash
  );

  console.log(
    "Confirmation email sent. Please check your inbox and click the confirmation link."
  );
};
// console.log("🚀 ~ file: services.js:43 ~ addContactToList ~ helpers:", helpers);

// Step 5: Adding and sync of the contact
const addContactToList = async (email, md5hash) => {
  // Verify MD5 checksum

  const isChecksumValid = helpers.verifyMD5Checksum(email, md5hash);

  if (!isChecksumValid) {
    throw new Error("MD5 checksum verification failed.");
  }
  console.log(
    "🚀 ~ file: services.js:41 ~ addContactToList ~ md5hash:",
    md5hash
  );
  const response = await axios.post(
    `https://api.mailjet.com/v3/REST/contactslist/${LIST_ID}/managecontact`,
    {
      Email: email,
      // Name: "Recipient Name",
      Action: "addnoforce",
      // This doesn't seem to be needed.
      // Properties: {
      //   // MD5hash: md5hash,
      //   // Add other properties as needed
      // },
    },
    {
      auth: {
        username: MJ_APIKEY_PUBLIC,
        password: MJ_APIKEY_PRIVATE,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Contact added to the list:", response.data);
};

exports.subscribeUser = subscribeUser;
exports.addContactToList = addContactToList;
