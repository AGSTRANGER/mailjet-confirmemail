const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const services = require("./services");

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// http://yourapp.com/confirm?email=pacot20861@bixolabs.com&md5hash=abcdef123456
// http://localhost:3000/confirm?email=pacot20861@bixolabs.com&md5hash=abcdef123456

// Endpoint for subscribing a user
app.post("/subscribe", async (req, res) => {
  try {
    console.log("🚀 ~ file: server.js:12 ~ app.post ~ req.body:", req.body);

    const { email, firstName, lastName } = req.body;

    console.log("🚀 ~ file: server.js:12 ~ app.post ~ email:", email);
    console.log("🚀 ~ file: server.js:12 ~ app.post ~ lastName:", lastName);
    console.log("🚀 ~ file: server.js:12 ~ app.post ~ firstName:", firstName);
    // Call subscribeUser from services
    await services.subscribeUser(email, firstName, lastName);

    // You can send a response back to the client
    res.status(200).json({ message: "User subscribed successfully." });
  } catch (error) {
    console.error("Error subscribing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint for confirmation
app.get("/confirm", async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log("🚀 ~ file: server.js:7 ~ app.get ~ userEmail:", userEmail);

    const md5hash = req.query.md5hash;
    console.log("🚀 ~ file: server.js:9 ~ app.get ~ md5hash:", md5hash);

    if (!userEmail || !md5hash) {
      // If required parameters are missing
      throw new Error("Missing required parameters.");
    }

    // Call addContactToList from services
    await services.addContactToList(userEmail, md5hash);

    // You can also render a confirmation page or redirect the user to a thank you page.
    res.send("Thank you for confirming your subscription!");
  } catch (error) {
    console.error("Error handling confirmation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
