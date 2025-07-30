import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    {
      id: "custom",
      apiKey: process.env.SMTP_API_KEY,
      name: "custom",
      type: "email",
      async sendVerificationRequest(params) {
        if (!process.env.EMAIL_JS_PRIVATE) {
          throw new ConvexError("EmailJS private key is not set");
        }

        const input = {
          accessToken: process.env.EMAIL_JS_PRIVATE,
          service_id: "service_1utpuz3",
          template_id: "template_qecqn96",
          template_params: {
            message: `Login via email: ${params.url}`,
            subject: 'Login via email',
            to: params.identifier,
          },
          user_id: "7-7SbUNuRxac7Bz5p",
        };
        const body = JSON.stringify(input);
        await fetch(
          'https://api.emailjs.com/api/v1.0/email/send',
          {
            body,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      },
    }
  ],
});
