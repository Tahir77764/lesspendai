import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Initialize Supabase if keys are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const hasSupabase = supabaseUrl && supabaseKey;

const supabase = hasSupabase ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, company, role, report } = body;

    // Basic abuse protection: Honeypot check (handled on client side, but we could check request headers/rate limits here)
    if (body.website_url) {
      // Honeypot field filled out, likely a bot
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const leadData = {
      email,
      company: company || null,
      role: role || null,
      total_savings_monthly: report?.totalSavingsMonthly || 0,
      report_data: report,
      created_at: new Date().toISOString()
    };

    // 1. Store in real backend (Supabase)
    if (hasSupabase && supabase) {
      const { error } = await supabase.from('leads').insert([leadData]);
      if (error) {
        console.error("Supabase insert error:", error);
      }
    } else {
      console.log("Supabase not configured. Mocking lead save:", leadData.email);
    }

    const shareData = {
      s: report.totalSavingsMonthly,
      c: report.currentEstimatedSpend,
      o: report.optimizedSpend,
      p: report.savingsPercentage,
      t: report.optimizedTools.map((t: any) => t.toolId)
    };
    const reportId = Buffer.from(JSON.stringify(shareData)).toString('base64url');
    
    // Determine the base URL (Env var for production > request origin > localhost)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin") || "http://localhost:3000";
    const shareableUrl = `${baseUrl}/share/${reportId}`;

    // 2. Transactional email (Nodemailer)
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Less Spend AI Audit Report</h2>
          <p>Hi there,</p>
          <p>Your custom AI stack audit is ready. We found potential savings of <strong>$${report.totalSavingsMonthly}/mo</strong>!</p>
          <p>You can view your detailed report and share it with your team using the link below:</p>
          <div style="margin: 30px 0;">
            <a href="${shareableUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Full Report</a>
          </div>
          ${leadData.total_savings_monthly > 500 ? '<p><em>Note: Since your potential savings are significant, consider booking a free consultation with Credex to implement these changes.</em></p>' : ''}
          <p>Best,<br/>The Less Spend AI Team</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Less Spend AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your AI Audit Report - Less Spend AI",
        html: emailHtml,
      });
      console.log(`[EMAIL SUCCESS] Sent audit report to ${email}.`);
    } catch (emailError) {
      console.error("[EMAIL ERROR] Failed to send email:", emailError);
      // We don't fail the request if email fails, just log it
    }

    return NextResponse.json({ 
      success: true, 
      shareableUrl 
    });
  } catch (error) {
    console.error("Lead Capture API Error:", error);
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
}
