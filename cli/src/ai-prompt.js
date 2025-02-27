const { GoogleGenerativeAI } = require("@google/generative-ai");

const analyzeContract = async (contract, apiKey, retries = 3, delay = 2000) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Your role and goal is to be an AI Smart Contract Auditor. Your job is to perform an audit on the given smart contract. Here is the smart contract: ${contract}.
  Please provide the results in the following array format for easy front-end display, as raw JSON without markdown or code block formatting:
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
          "metric": "Other Key Areas",
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
      "details": "Suggestions for improving the smart contract in terms of security, performance, and any other identified weaknesses."
    }
  ]
  Thank you.`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();

      // Clean up the response: remove markdown code blocks if present
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

      // Parse the cleaned response
      const auditResults = JSON.parse(responseText);

      console.log("Audit Report:");
      console.log(auditResults.find((r) => r.section === "Audit Report").details);

      console.log("\nMetric Scores:");
      auditResults
        .find((r) => r.section === "Metric Scores")
        .details.forEach((metric) => {
          console.log(`${metric.metric}: ${metric.score}/10`);
        });

      console.log("\nSuggestions for Improvement:");
      console.log(
        auditResults.find((r) => r.section === "Suggestions for Improvement").details
      );

      return auditResults; // Success, return the results
    } catch (error) {
      if (error.message.includes("503") && attempt < retries) {
        console.log(`Attempt ${attempt} failed (503). Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw new Error(`Analysis failed after ${attempt} attempts: ${error.message}`);
      }
    }
  }
};

module.exports = { analyzeContract };