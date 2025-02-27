import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;

if (!apiKey) {
  throw new Error(
    "API key is not defined. Please set NEXT_PUBLIC_API_KEY_GEMINI in your environment variables."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Metric {
  metric: string;
  score: number;
}

interface Suggestion {
  priority: string; // e.g., "Critical", "High Priority", "Medium Priority", "Low Priority"
  suggestion: string;
}

interface AuditResult {
  section: string;
  details: string | Metric[] | Suggestion[];
}

export const analyzeContract = async (
  contract: string,
  setResults: (result: AuditResult[]) => void,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  try {
    const prompt = `Your role and goal is to be an AI Smart Contract Auditor. Your job is to perform an audit on the given smart contract. Here is the smart contract: ${contract}.
    
    Please provide the results in the following array format for easy front-end display:
    [
      {
        "section": "Audit Report",
        "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
      },
      {
        "section": "Metric Scores",
        "details": [
          {
            "metric": "Security",
            "score": "0-10"
          },
          {
            "metric": "Performance",
            "score": "0-10"
          },
          {
            "metric": "Gas Efficiency",
            "score": "0-10"
          },
          {
            "metric": "Code Quality",
            "score": "0-10"
          },
          {
            "metric": "Documentation",
            "score": "0-10"
          }
        ]
      },
      {
        "section": "Suggestions for Improvement",
        "details": [
          {
            "priority": "Critical|High Priority|Medium Priority|Low Priority",
            "suggestion": "A specific suggestion for improving the smart contract."
          }
          // Add more suggestions as needed
        ]
      }
    ]
    Thank you.`;

    const result = await model.generateContent([prompt]);

    if (!result || !result.response || !result.response.text) {
      throw new Error("Invalid response from Gemini API.");
    }

    let responseText = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let auditResults: AuditResult[] = JSON.parse(responseText);

    // If the API doesn't return suggestions in the expected array format, parse the raw text
    const suggestionsSection = auditResults.find(
      (r) => r.section === "Suggestions for Improvement"
    );
    if (suggestionsSection && typeof suggestionsSection.details === "string") {
      const rawSuggestions = suggestionsSection.details;
      const parsedSuggestions: Suggestion[] = [];
      const suggestionRegex =
        /\*\*(Critical|High Priority|Medium Priority|Low Priority):\*\* ([^*]+)/g;
      let match;
      while ((match = suggestionRegex.exec(rawSuggestions)) !== null) {
        parsedSuggestions.push({
          priority: match[1],
          suggestion: match[2].trim(),
        });
      }
      suggestionsSection.details = parsedSuggestions;
    }

    setResults(auditResults);
  } catch (error) {
    console.error("Error during contract analysis:", error);
    setResults([
      {
        section: "Audit Report",
        details: "Failed to analyze the contract due to an error.",
      },
      {
        section: "Metric Scores",
        details: [],
      },
      {
        section: "Suggestions for Improvement",
        details: [],
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};