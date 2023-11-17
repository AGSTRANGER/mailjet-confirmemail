# Ummanite Email Subscription

This project implements a double opt-in email subscription system using the Mailjet API. Users can subscribe to a mailing list, and their confirmation is ensured through a customized confirmation link and MD5 checksum verification.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- Mailjet account with API key and list ID

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/ummanite-email-subscription.git
   cd ummanite-email-subscription
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory and add your Mailjet API key, private key, and list ID:**

   ```env
   MJ_APIKEY_PUBLIC=your_mailjet_public_key
   MJ_APIKEY_PRIVATE=your_mailjet_private_key
   LIST_ID=your_mailjet_list_id
   ```

## How it Works

### `subscribeUser`

The `subscribeUser` function initiates the subscription process. Here's a step-by-step explanation:

1. **MD5 Hash Generation:**

   - A unique MD5 hash is generated based on the user's email using the `generateMD5Hash` function from the `helpers.js` module.
   - This MD5 hash is crucial for creating a secure confirmation link.

2. **Confirmation Link:**

   - The base URL is determined based on the environment (production or localhost).
   - A confirmation link is created by appending the email and MD5 hash parameters to the base URL.

3. **Confirmation Email:**
   - The confirmation email is sent using the `sendConfirmationEmail` function from the `helpers.js` module.
   - The email includes the confirmation link and other necessary details.

### `addContactToList`

The `addContactToList` function adds a user to the Mailjet mailing list after confirming the subscription. Here's how it works:

1. **MD5 Checksum Verification:**

   - The MD5 checksum received from the confirmation link is verified against the calculated MD5 hash using the `verifyMD5Checksum` function from the `helpers.js` module.
   - If the verification fails, an error is thrown, indicating that the confirmation is not valid.

2. **Adding to the Mailjet List:**
   - If the MD5 checksum is valid, the user's email is added to the Mailjet mailing list using the Mailjet API.
   - The `Action: "addnoforce"` ensures that the user is added without forcing the action.

## Hashing Process Overview

The MD5 hashing process is used to generate a fixed-size hash value from the user's email. This hash is unique for each email and serves as a secure identifier. The generated MD5 hash is utilized in the confirmation link and verified during the subscription confirmation process to ensure the integrity and authenticity of the subscription.

---

### Usage

1. **Start the server:**

   ```bash
   npm start
   ```

   ...

2. **Subscribe a user by making a POST request to `/subscribe` with the following parameters: `email`, `firstName`, `lastName`.**

   Example using cURL:

   ```bash
   curl -X POST -d "email=user@example.com&firstName=John&lastName=Doe" http://localhost:3000/subscribe
   ```

3. **Confirm the subscription by opening the confirmation link sent to the user's email.**

   Example confirmation link:

   ```plaintext
   http://localhost:3000/confirm?email=user@example.com&md5hash=abcdef123456
   ```

4. **The user will be added to the Mailjet mailing list upon successful confirmation.**

## Structure

- **`server.js`**: Express server handling subscription and confirmation endpoints.
- **`services.js`**: Business logic for subscribing users and adding them to the Mailjet list.
- **`helpers.js`**: Helper functions, including MD5 hash generation and email confirmation.

## Environment Variables

- `MJ_APIKEY_PUBLIC`: Mailjet public API key.
- `MJ_APIKEY_PRIVATE`: Mailjet private API key.
- `LIST_ID`: Mailjet mailing list ID.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
