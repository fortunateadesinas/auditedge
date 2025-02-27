import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  IconChecklist,
  IconCircleCheck,
  IconGauge,
  IconChevronDown,
  IconChevronUp,
  IconTool,
} from "@tabler/icons-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ResultsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  loading: boolean;
  results: any; // Consider typing this properly later
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  closeModal,
  loading,
  results
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-500";
      case "High Priority":
        return "text-orange-500";
      case "Medium Priority":
        return "text-yellow-500";
      case "Low Priority":
        return "text-green-500";
      default:
        return "text-gray-300";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div
          className="fixed inset-0 bg-black opacity-50"
          aria-hidden="true"
        ></div>
        {loading ? (
          <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-xl transform transition-all max-w-lg w-full p-8 space-y-8">
            <div className="flex py-14 flex-col items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-14 w-14 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V4a8 8 0 00-8 8z"
                ></path>
              </svg>
              <p className="mt-4 text-lg text-gray-300">
                Analyzing smart contract...
              </p>
            </div>
          </div>
        ) : (
          results && (
            <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-xl transform transition-all max-w-3xl w-full p-8 space-y-8">
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-100">
                    Audit Results
                  </h2>
                </div>
                <div className="text-left">
                  <h3
                    className="text-xl space-x-2 cursor-pointer flex items-center justify-between text-gray-200 mb-4"
                    onClick={() => toggleSection("auditReport")}
                  >
                    <div className="flex items-center space-x-2">
                      <IconChecklist size={24} />
                      <span>Audit Report</span>
                    </div>
                    {expandedSection === "auditReport" ? (
                      <IconChevronUp size={24} />
                    ) : (
                      <IconChevronDown size={24} />
                    )}
                  </h3>
                  {expandedSection === "auditReport" && (
                    <p className="text-base text-gray-300">
                      {
                        results.find((r: any) => r.section === "Audit Report")
                          ?.details
                      }
                    </p>
                  )}
                </div>
                <div className="text-left">
                  <h3
                    className="text-xl space-x-2 cursor-pointer flex items-center justify-between text-gray-200 mb-4"
                    onClick={() => toggleSection("metricScores")}
                  >
                    <div className="flex items-center space-x-2">
                      <IconGauge size={24} />
                      <span>Metric Scores</span>
                    </div>
                    {expandedSection === "metricScores" ? (
                      <IconChevronUp size={24} />
                    ) : (
                      <IconChevronDown size={24} />
                    )}
                  </h3>
                  {expandedSection === "metricScores" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {results
                        .find((r: any) => r.section === "Metric Scores")
                        ?.details.map((metric: any, metricIndex: number) => {
                          const score = parseFloat(metric.score);
                          let color;
                          if (score >= 8) color = "#4caf50"; // green
                          else if (score < 5) color = "#f44336"; // red
                          else color = "#ffeb3b"; // yellow
                          return (
                            <div
                              key={metricIndex}
                              className="flex flex-col items-center"
                            >
                              <div className="w-24 h-24">
                                <CircularProgressbar
                                  value={score * 10}
                                  text={`${score}/10`}
                                  strokeWidth={10}
                                  styles={buildStyles({
                                    textSize: "16px",
                                    pathColor: color,
                                    textColor: color,
                                    trailColor: "#d6d6d6",
                                  })}
                                />
                              </div>
                              <p className="text-center mt-2 text-gray-300">
                                {metric.metric}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <h3
                    className="text-xl space-x-2 cursor-pointer flex items-center justify-between text-gray-200 mb-4"
                    onClick={() => toggleSection("suggestions")}
                  >
                    <div className="flex items-center space-x-2">
                      <IconCircleCheck size={24} />
                      <span>Suggestions for Improvement</span>
                    </div>
                    {expandedSection === "suggestions" ? (
                      <IconChevronUp size={24} />
                    ) : (
                      <IconChevronDown size={24} />
                    )}
                  </h3>
                  {expandedSection === "suggestions" && (
                    <div className="space-y-4">
                      {Array.isArray(
                        results.find(
                          (r: any) => r.section === "Suggestions for Improvement"
                        )?.details
                      ) ? (
                        results
                          .find(
                            (r: any) =>
                              r.section === "Suggestions for Improvement"
                          )
                          ?.details.map((suggestion: any, index: number) => (
                            <div key={index} className="space-y-1">
                              <p
                                className={`text-base font-semibold ${getPriorityColor(
                                  suggestion.priority
                                )}`}
                              >
                                {suggestion.priority}:
                              </p>
                              <p className="text-base text-gray-300">
                                {suggestion.suggestion}
                              </p>
                            </div>
                          ))
                      ) : (
                        <p className="text-base text-gray-300">
                          {
                            results.find(
                              (r: any) =>
                                r.section === "Suggestions for Improvement"
                            )?.details
                          }
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="text-green-500 hover:text-green-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </Dialog>
  );
};

export default ResultsModal;