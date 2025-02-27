'use client';
import { useState } from "react";
import Header from "./component/header";
import CustomCodeEditor from "./component/contract-input";
import ResultsModal from "./component/result-modal";
import { analyzeContract } from "../../utils/ai-prompt";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const analyze = async () => {
    setIsModalOpen(true);
    await analyzeContract(contract, setResults, setLoading);
  };


  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
      <Header />
      <CustomCodeEditor
        contract={contract}
        setContract={setContract}
        analyze={analyze}
      />
      <ResultsModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        loading={loading}
        results={results}
      />
    </main>
  );
}
