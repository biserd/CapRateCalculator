import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
  apiVersion: "2024-02-15",
  maxRetries: 3,
  timeout: 30000,
});

interface PropertyDetails {
  purchasePrice: number;
  monthlyRent: number;
  location: string;
  propertyType: string;
  squareFootage: number;
  yearBuilt: number;
  bedrooms: number;
  bathrooms: number;
  propertyCondition: string;
}

interface ValuationInsights {
  marketValueEstimate: string;
  confidenceScore: number;
  keyFactors: string[];
  recommendations: string[];
  marketTrends: string;
  riskAssessment: string;
  comparableProperties: string;
}

export async function generatePropertyInsights(
  propertyDetails: PropertyDetails,
): Promise<ValuationInsights> {
  const prompt = `You are an experienced real estate analyst. You need to analyze this property and provide detailed insights about its ROI and potential. Compare it with similar properties in the same zip code using the zillow search. Provide links to the similar properties:
Property Details:
- Price: $${propertyDetails.purchasePrice}
- Monthly Rent: $${propertyDetails.monthlyRent}
- Location: ${propertyDetails.location}
- Type: ${propertyDetails.propertyType}
- Size: ${propertyDetails.squareFootage} sq ft
- Year Built: ${propertyDetails.yearBuilt}
- Bedrooms: ${propertyDetails.bedrooms}
- Bathrooms: ${propertyDetails.bathrooms}
- Condition: ${propertyDetails.propertyCondition}

Provide a comprehensive ROI and assessment analysis including:
1. Estimated market value range and confidence score
2. Key factors affecting valuation
3. Investment recommendations
4. Market trends in the area
5. Risk assessment
6. Comparable properties analysis with links

Format the response as a JSON object with the following structure:
{
  "marketValueEstimate": "string with value range",
  "confidenceScore": number between 0 and 1,
  "keyFactors": array of strings,
  "recommendations": array of strings,
  "marketTrends": "string describing trends",
  "riskAssessment": "string with risk analysis",
  "comparableProperties": "string with comparables info"
}`;

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "system",
          content:
            "You are a professional real estate analyst specializing in property valuation and market analysis. Please respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error("Invalid or empty OpenAI response");
    }

    const result = JSON.parse(response.choices[0].message.content);
    return result as ValuationInsights;
  } catch (error: any) {
    console.error("Detailed error generating property insights:", {
      message: error.message,
      status: error.status,
      response: error.response,
      stack: error.stack,
    });

    if (error.message.includes("insufficient_quota")) {
      throw new Error(
        "OpenAI API quota exceeded. Please check your API key and billing status.",
      );
    }

    throw new Error(`Failed to generate property insights: ${error.message}`);
  }
}
