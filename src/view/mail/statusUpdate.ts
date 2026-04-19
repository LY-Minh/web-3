export const statusUpdateHTML = (username: string, itemName: string, claimStatus: string) => {
    return `
    <html>
      <body>
        <p>Hi ${username},</p>
        <p>Your claim for the item "<strong>${itemName}</strong>" has been updated to: <strong>${claimStatus}</strong>.</p>
        <p>Thank you for using our service!</p>
      </body>
    </html>
  `;
};