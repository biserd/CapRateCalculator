import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
// do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  propertyDetails: PropertyDetails
): Promise<ValuationInsights> {
  const prompt = `Analyze this real estate property and provide detailed insights:
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

Provide a comprehensive analysis including:
1. Estimated market value range and confidence score
2. Key factors affecting valuation
3. Investment recommendations
4. Market trends in the area
5. Risk assessment
6. Comparable properties analysis

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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate analyst specializing in property valuation and market analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result as ValuationInsights;
  } catch (error) {
    console.error('Error generating property insights:', error);
    throw new Error('Failed to generate property insights');
  }
}
