import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    // 2. Transactional email (Mocked Resend/Postmark)
    console.log(`[EMAIL MOCK] Sending audit report to \${email}.`);
    if (leadData.total_savings_monthly > 500) {
      console.log(`[EMAIL MOCK] High savings (>\$500) detected. Including Credex consultation booking link.`);
    }

    // 3. Shareable Result URL (Generate a stateless ID)
    const shareData = {
      s: report.totalSavingsMonthly,
      c: report.currentEstimatedSpend,
      o: report.optimizedSpend,
      p: report.savingsPercentage,
      t: report.optimizedTools.map((t: any) => t.toolId)
    };
    const reportId = Buffer.from(JSON.stringify(shareData)).toString('base64');
    const shareableUrl = `${request.headers.get("origin") || "https://lesspend.ai"}/share/${reportId}`;

    return NextResponse.json({ 
      success: true, 
      shareableUrl 
    });
  } catch (error) {
    console.error("Lead Capture API Error:", error);
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
}
