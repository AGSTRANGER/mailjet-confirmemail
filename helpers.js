const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

// Mailjet API credentials
//
const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;
console.log("🚀 ~ file: helpers.js:7 ~ MJ_APIKEY_PRIVATE:", MJ_APIKEY_PRIVATE);
console.log("🚀 ~ file: helpers.js:7 ~ MJ_APIKEY_PUBLIC:", MJ_APIKEY_PUBLIC);

// Function to generate MD5 hash
const generateMD5Hash = (data) => {
  const hash = crypto.createHash("md5").update(data).digest("hex");
  return hash;
};

// Step 3: Sending of the confirmation email
const sendConfirmationEmail = async (
  email,
  firstName,
  lastName,
  confirmationLink,
  MD5hash
) => {
  const response = await axios.post(
    "https://api.mailjet.com/v3.1/send",
    {
      Messages: [
        {
          From: {
            Email: "developpement.it@ummanite.org",
            Name: "Ummanite",
          },
          To: [{ Email: email, Name: `${firstName} ${lastName}` }],
          Variables: {
            MD5hash: MD5hash,
            EmailOfTheUser: email,
          },
          TemplateLanguage: true,
          Subject: "Ummanite confirmation email",
          TextPart: `Welcome to our mailing list! Please activate your subscription by clicking this link: ${confirmationLink}`,
          HTMLPart: `Welcome to our mailing list! Please activate your subscription by clicking this link: ${confirmationLink}`,
        },
      ],
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

  console.log("Confirmation email sent:", response.data);
};

exports.generateMD5Hash = generateMD5Hash;
exports.sendConfirmationEmail = sendConfirmationEmail;
