import transporter from "./email";
import { statusUpdateHTML } from "@/view/mail/statusUpdate";

export const sendStatusUpdateEmail = async (to: string, name: string, itemName: string, claimStatus: string) => {
    const subject = `Update on your claim for ${itemName}`;
    const html = statusUpdateHTML(name, itemName, claimStatus);

    const mailOptions = {
      from: "noreply@lostnfoundteam.com",
      to: to,
      subject: subject,
      html: html
    };
    try{
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
