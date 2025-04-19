
import { toast } from "@/components/ui/sonner";

// Types for Gemini API
interface GeminiContent {
  parts: {
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string; // base64 encoded data
    };
  }[];
}

interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
}

interface GeminiResponse {
  candidates: {
    content: GeminiContent;
    finishReason: string;
    index: number;
    safetyRatings: any[];
  }[];
}

// Get the API key from localStorage or use the default one
const getApiKey = () => {
  const storedKey = localStorage.getItem('GEMINI_API_KEY');
  return storedKey || "GEMINI_API_KEY"; // Replace with your actual API key
};

// Function to store the API key
export const setGeminiApiKey = (apiKey: string) => {
  localStorage.setItem('GEMINI_API_KEY', apiKey);
};

// Function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

// Function to determine MIME type
export const getMimeType = (file: File): string => {
  return file.type || "application/octet-stream";
};

// Analyze medical data with Gemini API
export const analyzeMedicalData = async (
  images: File[],
  textData: string,
  patientId: string
) => {
  try {
    // Get the API key
    const API_KEY = getApiKey();
    
    // Convert images to base64
    const imagePromises = images
      .filter((file) => file.type.startsWith("image/"))
      .map(async (file) => {
        const base64Data = await fileToBase64(file);
        const mimeType = getMimeType(file);
        return { data: base64Data, mimeType };
      });

    const imageData = await Promise.all(imagePromises);

    // Construct the prompt
    let prompt = `You are an expert medical diagnostic assistant analyzing medical data.
    
    Patient ID: ${patientId}
    
    Clinical Information:
    ${textData || "No clinical notes provided."}
    
    Based on the provided images and clinical information, please analyze the medical data and provide:
    1. Primary diagnosis with confidence score
    2. Alternative diagnoses to consider
    3. Key findings that support your diagnosis
    4. Recommended follow-up tests or actions
    5. Detailed explanation of your reasoning
    
    Maintain a professional, clinical tone and provide evidence-based assessments.`;

    // Construct request payload
    const contents: GeminiContent[] = [
      {
        parts: [{ text: prompt }],
      },
    ];

    // Add image data if available
    imageData.forEach((img) => {
      contents.push({
        parts: [
          {
            inlineData: {
              mimeType: img.mimeType,
              data: img.data,
            },
          },
        ],
      });
    });

    const requestBody: GeminiRequest = {
      contents,
      generationConfig: {
        temperature: 0.2, // Low temperature for more deterministic outputs
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };

    // Log the API request (without sensitive data)
    console.log("Sending request to Gemini API with", images.length, "images");
    
    // In a real implementation, we would make an actual API call
    // For now, we'll simulate a response for development purposes
    if (API_KEY === "GEMINI_API_KEY") {
      // If using the default key, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      return {
        success: true,
        message: "Analysis completed successfully",
        diagnosis: "Simulated diagnosis results (API key not provided)",
        confidence: 0.85,
        alternatives: ["Alternative diagnosis 1", "Alternative diagnosis 2"],
        findings: ["Finding 1", "Finding 2", "Finding 3"],
        recommendations: ["Recommendation 1", "Recommendation 2"]
      };
    } else {
      // With a real key, make the actual API call
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Gemini API error:", errorData);
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const result = data.candidates[0].content.parts[0].text;

        return {
          success: true,
          message: "Analysis completed successfully",
          result: result,
        };
      } catch (apiError) {
        console.error("API call error:", apiError);
        throw apiError;
      }
    }
  } catch (error) {
    console.error("Error analyzing medical data:", error);
    toast.error("Failed to analyze medical data. Please try again.");
    return {
      success: false,
      message: "Analysis failed",
      error,
    };
  }
};
