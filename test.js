const axios = require("axios");
const crypto = require("crypto");

// Mailjet API credentials
const MJ_APIKEY_PUBLIC = "ef21eed927803ec63513d03b5f71ba3b";
const MJ_APIKEY_PRIVATE = "2bec61f9a6481b5e3b53dee581e0ba65";

// Mailjet list ID
const LIST_ID = "your_list_id";

// Function to generate MD5 hash
const generateMD5Hash = (data) => {
  const hash = crypto.createHash("md5").update(data).digest("hex");
  return hash;
};

// Step 1: Contact's subscription
const subscribeUser = async (email, firstName, lastName) => {
  // Step 2: Creation of the customized confirmation link
  const MD5hash = generateMD5Hash(email);
  const confirmationLink = `http://ummanite.com?EmailOfTheUser=${email}&MD5hash=${MD5hash}`;

  // Step 3: Sending of the confirmation email
  await sendConfirmationEmail(
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

// Step 5: Adding and sync of the contact
const addContactToList = async (email) => {
  const md5hash = generateMD5Hash(email); // Regenerate MD5 hash based on the email address

  const response = await axios.post(
    `https://api.mailjet.com/v3/REST/contactslist/${LIST_ID}/managecontact`,
    {
      Email: email,
      Name: "Recipient Name",
      Action: "addnoforce",
      Properties: {
        MD5hash: md5hash,
        // Add other properties as needed
      },
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

// Example usage
subscribeUser("pacot20861@bixolabs.com", "Ahmed", "Ghrib");
