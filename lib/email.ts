import nodemailer from "nodemailer";
import { Booking } from "@/types";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmationToGuest(booking: Booking) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: booking.email,
    subject: `Booking Request Received – ${process.env.NEXT_PUBLIC_VILLA_NAME}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #C9A96E; border-bottom: 1px solid #C9A96E; padding-bottom: 12px;">
          Booking Request Received
        </h1>
        <p>Dear ${booking.firstName},</p>
        <p>Thank you for your enquiry. We have received your booking request and will confirm availability shortly.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr style="background: #FAF7F2;">
            <td style="padding: 12px; font-weight: bold;">Check-in</td>
            <td style="padding: 12px;">${format(new Date(booking.checkIn), "EEEE, d MMMM yyyy")}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Check-out</td>
            <td style="padding: 12px;">${format(new Date(booking.checkOut), "EEEE, d MMMM yyyy")}</td>
          </tr>
          <tr style="background: #FAF7F2;">
            <td style="padding: 12px; font-weight: bold;">Duration</td>
            <td style="padding: 12px;">${booking.totalNights} nights</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Guests</td>
            <td style="padding: 12px;">${booking.adults} adults${booking.children > 0 ? `, ${booking.children} children` : ""}</td>
          </tr>
        </table>
        <p>We will be in touch within 24 hours to confirm your reservation.</p>
        <p style="color: #C9A96E;">Warm regards,<br/>${process.env.NEXT_PUBLIC_VILLA_NAME} Team</p>
      </div>
    `,
  });
}

export async function sendBookingNotificationToAdmin(booking: Booking) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL_NOTIFY,
    subject: `New Booking Request – ${booking.firstName} ${booking.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking Request</h2>
        <p><strong>Guest:</strong> ${booking.firstName} ${booking.lastName}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Check-in:</strong> ${format(new Date(booking.checkIn), "d MMM yyyy")}</p>
        <p><strong>Check-out:</strong> ${format(new Date(booking.checkOut), "d MMM yyyy")}</p>
        <p><strong>Nights:</strong> ${booking.totalNights}</p>
        <p><strong>Guests:</strong> ${booking.adults} adults, ${booking.children} children</p>
        ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ""}
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings/${booking.id}" style="background: #C9A96E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Admin Panel</a></p>
      </div>
    `,
  });
}

export async function sendBookingStatusUpdate(booking: Booking, status: "CONFIRMED" | "REJECTED") {
  const isConfirmed = status === "CONFIRMED";
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: booking.email,
    subject: `Booking ${isConfirmed ? "Confirmed" : "Update"} – ${process.env.NEXT_PUBLIC_VILLA_NAME}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #C9A96E;">
          ${isConfirmed ? "🎉 Your Booking is Confirmed!" : "Booking Status Update"}
        </h1>
        <p>Dear ${booking.firstName},</p>
        ${isConfirmed
          ? `<p>We are delighted to confirm your reservation at ${process.env.NEXT_PUBLIC_VILLA_NAME}. We look forward to welcoming you.</p>`
          : `<p>Unfortunately, we are unable to accommodate your booking request for the requested dates. We encourage you to check other available dates or contact us directly.</p>`
        }
        <p><strong>Check-in:</strong> ${format(new Date(booking.checkIn), "EEEE, d MMMM yyyy")}</p>
        <p><strong>Check-out:</strong> ${format(new Date(booking.checkOut), "EEEE, d MMMM yyyy")}</p>
        <p style="color: #C9A96E;">Warm regards,<br/>${process.env.NEXT_PUBLIC_VILLA_NAME} Team</p>
      </div>
    `,
  });
}
