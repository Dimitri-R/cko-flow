# Checkout.com Flow Integration Demo

This project demonstrates an end-to-end payment flow integration using [Checkout.com Flow payment process](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-website/get-started-with-flow).

## Features

- Uses the Flow component from Checkout.com Web Components
- Full payment session creation
- Payments are authorized only (`capture: false`)
- Webhook receiver for real-time payment status updates
- Displays frontend message after successful authorization

## Tech Stack

- Node.js + Express (Backend)
- HTML + JavaScript (Frontend)
- Hosted on a GCP Virtual Machine for the demo

## Run the demo locally

1. **Build the server:**

   ```bash
   npm install
   ```

2. **Set your environment variable:**

   ```bash
   export SECRET_KEY="{your_secret_key}"
   ```

3. **Run the server:**

   ```bash
   npm start
   ```

4. **Open in browser:**

   [http://localhost:3000/index.html](http://localhost:3000/index.html)

## Notes

- Make sure port `3000` is open in your VM’s firewall or networking settings.
- Webhooks are sent to `/webhook` and logged to the terminal for inspection.
- Test using cards and methods available in the [Checkout.com Sandbox docs](https://www.checkout.com/docs/developer-resources/testing/test-cards).