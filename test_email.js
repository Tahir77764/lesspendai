require("dotenv").config({ path: "c:/Users/tahir/OneDrive/Desktop/MY MAIN FINAL/Backend/.env" });
const { sendReportEmail } = require("c:/Users/tahir/OneDrive/Desktop/MY MAIN FINAL/Backend/utils/sendOtp");

async function test() {
    try {
        console.log("Attempting to send email...");
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        await sendReportEmail(process.env.ADMIN_EMAIL, "https://example.com/report.pdf");
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}

test();
