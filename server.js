const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Parse incoming JSON request bodies
app.use(express.json());

// Load Checkout.com's secret key from environment variables
const SECRET_KEY = process.env.SECRET_KEY;

// Create a new Payment Session
app.post("/create-payment-sessions", async (_req, res) => {
  try {
    const response = await fetch("https://api.sandbox.checkout.com/payment-sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 6540,
        currency: "GBP",
        reference: "ORD-123A",
        description: "Payment for Guitars and Amps",
        capture: false,

        // Explicitly specify the processing channel
        processing_channel_id: "pc_ilbbwdqbdzkezerlhndhr6aahm",

        billing_descriptor: {
          name: "Jia Tsang",
          city: "London",
        },

        customer: {
          email: "jia.tsang@example.com",
          name: "Jia Tsang",
        },

        shipping: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        billing: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },

        risk: {
          enabled: true,
        },

        success_url: "http://localhost:3000/?status=succeeded",
        failure_url: "http://localhost:3000/?status=failed",

        metadata: {},

        items: [
          {
            name: "Guitar",
            quantity: 1,
            unit_price: 1635,
          },
          {
            name: "Amp",
            quantity: 3,
            unit_price: 1635,
          },
        ],
      }),
    });

    const parsedPayload = await response.json();

    // Forward Checkout's response back to the frontend
    res.status(response.status).send(parsedPayload);
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).send({ error: "Failed to create payment session" });
  }
});

// Start the server on port 3000
app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);
