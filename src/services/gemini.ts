import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateBusinessIdeas(location: string, investmentRange: string = "All") {
  const model = "gemini-3-flash-preview";
  const prompt = `Act as a local business intelligence expert. For the location "${location}", identify exactly 9 unique business opportunities.
  
  CRITICAL REQUIREMENT:
  1. 3 opportunities must be LOW investment (Under ₹50,000).
  2. 3 opportunities must be MID investment (₹50,000 - ₹5 Lakhs).
  3. 3 opportunities must be HIGH investment (Above ₹10 Lakhs).
  
  ${investmentRange !== "All" ? `The user is specifically interested in the "${investmentRange}" range, so prioritize ideas in that category but still provide all 9 levels.` : ""}

  Consider local market gaps, trends, and demographics.
  
  Return the response in JSON format with the following structure:
  {
    "opportunities": [
      {
        "title": "Business Name",
        "description": "Short description of the idea",
        "investment": "₹X - ₹Y",
        "investmentLevel": "Low" | "Mid" | "High",
        "demand": "High/Medium/Low",
        "competition": "High/Medium/Low",
        "score": 0-100,
        "market": "Target audience",
        "usp": "Unique selling point"
      }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating business ideas:", error);
    return { opportunities: [] };
  }
}

export async function generateFeasibilityReport(idea: string, location: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate a highly detailed business feasibility and estimation report for "${idea}" in "${location}".
  
  The report must follow this EXACT structure for the JSON response:
  {
    "title": "Business Estimation",
    "intro": "Detailed intro about the business and location context",
    "initialInvestment": {
      "items": [
        { "item": "Name", "description": "Details", "cost": "₹Amount" }
      ],
      "total": "₹Total Amount",
      "note": "Optional note about rent/deposit"
    },
    "operatingCosts": {
      "items": [
        { "expense": "Name", "description": "Details", "cost": "₹Amount" }
      ],
      "total": "₹Total Monthly Cost"
    },
    "revenueProjections": {
      "pricePerUnit": "₹Amount",
      "salesPerDay": "Initial, Mid-year, Late-year estimates",
      "quarterlyRevenue": {
        "q1": "₹Amount",
        "q2": "₹Amount",
        "q3_q4": "₹Amount"
      },
      "annualRevenue": "₹Total Amount",
      "addOns": "Description of potential extra revenue"
    },
    "breakEven": {
      "monthlyProfit": "₹Range",
      "breakEvenPoint": "Time period",
      "realisticTimeline": "Time period"
    },
    "targetAudience": ["Segment 1", "Segment 2"],
    "competition": {
      "direct": ["Competitor 1"],
      "indirect": ["Competitor 2"],
      "advantage": "Your unique edge"
    },
    "successFactors": ["Factor 1", "Factor 2"],
    "challenges": ["Challenge 1", "Challenge 2"],
    "marketPotential": {
      "size": "Market stats",
      "growthRate": "Percentage",
      "spending": "Per person stats",
      "potential": "Year 2 growth estimate"
    },
    "nextSteps": {
      "immediate": ["Step 1", "Step 2"],
      "expansion": ["Idea 1", "Idea 2"]
    },
    "summary": {
      "investment": "₹Amount",
      "monthlyCost": "₹Amount",
      "revenue": "₹Range",
      "profit": "₹Range",
      "breakEven": "Time period"
    },
    "conclusion": "Final feasibility verdict",
    "score": 0-100
  }`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating feasibility report:", error);
    return null;
  }
}
