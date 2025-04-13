const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Insert your secret key here
const SECRET_KEY = process.env.SECRET_KEY;

app.post("/create-payment-sessions", async (_req, res) => {
  // Create a PaymentSession
  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
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
        success_url: "https://cko-flow.onrender.com/?status=succeeded",
        failure_url: "https://cko-flow.onrender.com/?status=failed",
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
    }
  );

  const parsedPayload = await request.json();

  res.status(request.status).send(parsedPayload);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(3000, () =>
  console.log("Node server listening on port 3000: http://localhost:3000/")
);

app.get("/verify-payment", async (req, res) => {
  const paymentId = req.query["cko-payment-id"];
  if (!paymentId) return res.status(400).send("Missing payment ID");

  try {
    const request = await fetch(
      `https://api.sandbox.checkout.com/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const payment = await request.json();
    console.log("Payment status:", payment.status);
    res.json(payment);
  } catch (error) {
    console.error("Payment lookup failed", error);
    res.status(500).send("Payment verification failed");
  }
});
