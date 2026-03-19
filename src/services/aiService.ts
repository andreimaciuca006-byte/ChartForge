import { GoogleGenAI, Type } from "@google/genai";
import { DataRow, ChartType } from "../store";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
  return new GoogleGenAI({ apiKey });
};

export const parseDataFromText = async (text: string): Promise<{ data: DataRow[], suggestedType: ChartType, title: string }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse the following text into a structured chart data format. 
    Text: "${text}"
    
    Return a JSON object with:
    1. "data": an array of objects with "label" (string) and "value" (number).
    2. "suggestedType": one of 'bar', 'line', 'area', 'pie', 'scatter'.
    3. "title": a suitable title for the chart.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER }
              },
              required: ["label", "value"]
            }
          },
          suggestedType: { type: Type.STRING },
          title: { type: Type.STRING }
        },
        required: ["data", "suggestedType", "title"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return {
    data: result.data.map((d: any, i: number) => ({ ...d, id: i.toString() })),
    suggestedType: result.suggestedType as ChartType,
    title: result.title
  };
};

export const getChartSuggestions = async (data: DataRow[]): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this data and provide a brief insight or suggestion for visualization: ${JSON.stringify(data)}`,
  });
  return response.text;
};
