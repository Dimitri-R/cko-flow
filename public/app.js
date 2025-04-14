/* global CheckoutWebComponents */
(async () => {
  // Insert your public key here
  const PUBLIC_KEY = "pk_sbox_gztklkcll6soez4h2jc3k6fbmeb";

  // Request a new payment session from the backend
  const response = await fetch("/create-payment-sessions", { method: "POST" });
  const paymentSession = await response.json();

  if (!response.ok) {
    console.error("Error creating payment session", paymentSession);
    return;
  }

  // Initialize Checkout Web Components with the session and configuration
  const checkout = await CheckoutWebComponents({
    publicKey: PUBLIC_KEY,
    environment: "sandbox",
    locale: "en-GB",
    paymentSession,
    onReady: () => {
      console.log("onReady");
    },
    onPaymentCompleted: (_component, paymentResponse) => {
      console.log("Create Payment with PaymentId: ", paymentResponse.id);
      console.log("Payment ID:", paymentResponse.id); // Useful for debugging or verifying from backend

       // Show custom confirmation message
      document.getElementById("paymentMessage").textContent =
      "The payment has been authorized and will be captured once the parcel has been shipped.";
      document.getElementById("paymentMessage").style.display = "block";

    },
    onChange: (component) => {
      console.log(
        `onChange() -> isValid: "${component.isValid()}" for "${
          component.type
        }"`,
      );
    },
    onError: (component, error) => {
      console.log("onError", error, "Component", component.type);
    },
  });

  // Create and mount the Flow component to the container
  const flowComponent = checkout.create("flow");

  flowComponent.mount(document.getElementById("flow-container"));
})();

function triggerToast(id) {
  var element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
}

const urlParams = new URLSearchParams(window.location.search);
const paymentStatus = urlParams.get("status");
const paymentId = urlParams.get("cko-payment-id");

if (paymentStatus === "succeeded") {
  triggerToast("successToast");

  const messageBox = document.getElementById("paymentMessage");
  if (messageBox) {
    messageBox.innerText =
      "✅ Payment has been authorized. Your parcel will be shipped shortly, and the amount will be captured upon dispatch.";
    messageBox.style.display = "block";
  }
}


if (paymentStatus === "failed") {
  triggerToast("failedToast");
}

if (paymentId) {
  console.log("Create Payment with PaymentId: ", paymentId);
}
