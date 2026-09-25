const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret, defineString } = require("firebase-functions/params");

initializeApp();

const whatsappAccessToken = defineSecret("WHATSAPP_ACCESS_TOKEN");
const whatsappPhoneNumberId = defineSecret("WHATSAPP_PHONE_NUMBER_ID");
const whatsappToNumber = defineSecret("WHATSAPP_TO_NUMBER");
const whatsappGraphVersion = defineString("WHATSAPP_GRAPH_API_VERSION", {
  default: "v23.0"
});
const whatsappAlertTemplate = defineString("WHATSAPP_ALERT_TEMPLATE_NAME", {
  default: "website_chat_alert"
});
const whatsappAlertLanguage = defineString("WHATSAPP_ALERT_TEMPLATE_LANGUAGE", {
  default: "en_US"
});

exports.alertWhatsAppForNewWebsiteChat = onDocumentCreated(
  {
    document: "chats/{chatId}/messages/{messageId}",
    region: "europe-west1",
    secrets: [whatsappAccessToken, whatsappPhoneNumberId, whatsappToNumber]
  },
  async (event) => {
    const message = event.data?.data();
    if (!message || message.sender !== "visitor") return;

    const firestore = getFirestore();
    const chatRef = firestore.doc(`chats/${event.params.chatId}`);
    const shouldAlert = await firestore.runTransaction(async (transaction) => {
      const chatSnapshot = await transaction.get(chatRef);
      const chat = chatSnapshot.data() ?? {};
      const lastAlert = chat.lastWhatsAppAlertAt;
      const lastAlertMs = lastAlert instanceof Timestamp ? lastAlert.toMillis() : 0;

      if (Date.now() - lastAlertMs < 60000) return false;

      transaction.set(chatRef, { lastWhatsAppAlertAt: FieldValue.serverTimestamp() }, { merge: true });
      return true;
    });

    if (!shouldAlert) return;

    const chat = (await chatRef.get()).data() ?? {};
    const visitorName = String(chat.visitorName ?? "Website visitor").slice(0, 80);
    const visitorContact = String(chat.visitorContact ?? "No contact supplied").slice(0, 120);
    const messageText = String(message.text ?? "").slice(0, 700);

    const response = await fetch(
      `https://graph.facebook.com/${whatsappGraphVersion.value()}/${whatsappPhoneNumberId.value()}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappAccessToken.value()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: whatsappToNumber.value().replace(/\D/g, ""),
          type: "template",
          template: {
            name: whatsappAlertTemplate.value(),
            language: { code: whatsappAlertLanguage.value() },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: visitorName },
                  { type: "text", text: visitorContact },
                  { type: "text", text: messageText }
                ]
              }
            ]
          }
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`WhatsApp alert failed (${response.status}): ${errorBody.slice(0, 500)}`);
    }
  }
);
