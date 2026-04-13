import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.error("GEMINI_API_KEY is missing or invalid. Please set it in your environment variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export async function generateBusinessIdeas(location: string, investmentRange: string = "All") {
  const ai = getAI();
  const model = "gemini-flash-latest";
  const prompt = `Act as a local business intelligence expert. For the location "${location}", identify exactly 9 unique business opportunities.
  
  CRITICAL REQUIREMENT:
  1. 3 opportunities must be LOW investment (Under ₹50,000).
  2. 3 opportunities must be MID investment (₹50,000 - ₹5 Lakhs).
  3. 3 opportunities must be HIGH investment (Above ₹10 Lakhs).
  
  ${investmentRange !== "All" ? `The user is specifically interested in the "${investmentRange}" range, so prioritize ideas in that category but still provide all 9 levels.` : ""}

  Consider local market gaps, trends, and demographics.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  investment: { type: Type.STRING },
                  investmentLevel: { type: Type.STRING, enum: ["Low", "Mid", "High"] },
                  demand: { type: Type.STRING },
                  competition: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  market: { type: Type.STRING },
                  usp: { type: Type.STRING }
                },
                required: ["title", "description", "investment", "investmentLevel", "demand", "competition", "score", "market", "usp"]
              }
            }
          },
          required: ["opportunities"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating business ideas:", error);
    // Return some mock data if it fails so the UI doesn't break completely
    return { 
      opportunities: [
        {
          title: "Local Delivery Service",
          description: "A specialized delivery service for local shops in " + location,
          investment: "₹10,000 - ₹20,000",
          investmentLevel: "Low",
          demand: "High",
          competition: "Medium",
          score: 85,
          market: "Local residents",
          usp: "Ultra-fast local delivery"
        }
      ] 
    };
  }
}

export async function generateFeasibilityReport(idea: string, location: string) {
  const ai = getAI();
  const model = "gemini-flash-latest";
  const prompt = `Generate a highly detailed business feasibility and estimation report for "${idea}" in "${location}".
  
  CRITICAL REQUIREMENT:
  - All currency values MUST be in Indian Rupees (INR).
  - Use the "₹" symbol for all price values.
  - Do NOT use dollars ($) or any other currency.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            intro: { type: Type.STRING },
            initialInvestment: {
              type: Type.OBJECT,
              properties: {
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      description: { type: Type.STRING },
                      cost: { type: Type.STRING }
                    }
                  }
                },
                total: { type: Type.STRING },
                note: { type: Type.STRING }
              }
            },
            operatingCosts: {
              type: Type.OBJECT,
              properties: {
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      expense: { type: Type.STRING },
                      description: { type: Type.STRING },
                      cost: { type: Type.STRING }
                    }
                  }
                },
                total: { type: Type.STRING }
              }
            },
            revenueProjections: {
              type: Type.OBJECT,
              properties: {
                pricePerUnit: { type: Type.STRING },
                salesPerDay: { type: Type.STRING },
                quarterlyRevenue: {
                  type: Type.OBJECT,
                  properties: {
                    q1: { type: Type.STRING },
                    q2: { type: Type.STRING },
                    q3_q4: { type: Type.STRING }
                  }
                },
                annualRevenue: { type: Type.STRING },
                addOns: { type: Type.STRING }
              }
            },
            breakEven: {
              type: Type.OBJECT,
              properties: {
                monthlyProfit: { type: Type.STRING },
                breakEvenPoint: { type: Type.STRING },
                realisticTimeline: { type: Type.STRING }
              }
            },
            targetAudience: { type: Type.ARRAY, items: { type: Type.STRING } },
            competition: {
              type: Type.OBJECT,
              properties: {
                direct: { type: Type.ARRAY, items: { type: Type.STRING } },
                indirect: { type: Type.ARRAY, items: { type: Type.STRING } },
                advantage: { type: Type.STRING }
              }
            },
            successFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketPotential: {
              type: Type.OBJECT,
              properties: {
                size: { type: Type.STRING },
                growthRate: { type: Type.STRING },
                spending: { type: Type.STRING },
                potential: { type: Type.STRING }
              }
            },
            nextSteps: {
              type: Type.OBJECT,
              properties: {
                immediate: { type: Type.ARRAY, items: { type: Type.STRING } },
                expansion: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                investment: { type: Type.STRING },
                monthlyCost: { type: Type.STRING },
                revenue: { type: Type.STRING },
                profit: { type: Type.STRING },
                breakEven: { type: Type.STRING }
              }
            },
            conclusion: { type: Type.STRING },
            score: { type: Type.NUMBER }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating feasibility report:", error);
    return null;
  }
}
