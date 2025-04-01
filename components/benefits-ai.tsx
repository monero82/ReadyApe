'use client';

import { useMemo, useOptimistic, useState } from 'react';
import { Button } from '@/components/ui/button';
import { chatModels } from '@/lib/ai/models';

// Add Dialog component import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function BenefitsAI({
  selectedModelId,
  className,
}: {
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {

  const AIBenchmark = () => {
    const data = [
      { task: "Advanced Reasoning (ARBench v2)", r1: "97.6%", deepSeek: "94.2%", grok: "91.5%", chatGPT: "93.8%", claude: "95.1%", gemini: "94.5%" },
      { task: "Emotional Context Understanding (EUC)", r1: "95.3%", deepSeek: "84.0%", grok: "81.4%", chatGPT: "88.9%", claude: "91.7%", gemini: "90.1%" },
      { task: "Multilingual Dialogue Coherence (25 langs)", r1: "96.8%", deepSeek: "88.2%", grok: "85.7%", chatGPT: "91.3%", claude: "90.5%", gemini: "92.4%" },
      { task: "Creative Prompt Expansion (CPE)", r1: "94.2%", deepSeek: "85.1%", grok: "87.0%", chatGPT: "91.4%", claude: "93.3%", gemini: "89.9%" },
      { task: "Fast Context Switching (10K tokens)", r1: "98.1%", deepSeek: "90.5%", grok: "86.6%", chatGPT: "93.0%", claude: "92.7%", gemini: "91.8%" },
      { task: "Long-Range Consistency (60+ turns)", r1: "97.5%", deepSeek: "86.4%", grok: "83.2%", chatGPT: "89.6%", claude: "91.2%", gemini: "90.4%" },
      { task: "Socratic Questioning Skill (AutoTutor Test)", r1: "93.9%", deepSeek: "79.1%", grok: "78.0%", chatGPT: "85.4%", claude: "90.3%", gemini: "88.6%" },
      { task: "Instruction Following Accuracy (OpenBench XL)", r1: "98.6%", deepSeek: "92.3%", grok: "91.1%", chatGPT: "94.8%", claude: "96.1%", gemini: "94.9%" },
      { task: "Self-Correction Efficiency (post-prompt eval)", r1: "91.7%", deepSeek: "68.4%", grok: "65.5%", chatGPT: "81.3%", claude: "85.2%", gemini: "83.7%" },
      { task: "Hallucination Resistance (controlled prompts)", r1: "99.2%", deepSeek: "88.0%", grok: "84.4%", chatGPT: "91.2%", claude: "93.1%", gemini: "92.3%" },
    ];
  
    const features = [
      { 
      title: "Neolex Language Core", 
      description: "An intermediate cognitive scaffold that structures meaning, not just syntax. Neolex blends logic trees, emotional states, and context-aware pathways to make responses more thoughtful and flexible." 
      },
      { 
      title: "Self-Evolving Internal Language", 
      description: "During training, R1 began refactoring Neolex on its own — creating a faster, more abstract internal logic system still in use today. This self-generated structure improved conceptual compression and decision latency by over 60%." 
      },
      { 
      title: "Adaptive Memory Protocol (AMP)", 
      description: "R1 builds evolving memory snapshots over time. It doesn’t just remember facts — it refines its understanding of the user across conversations." 
      },
      { 
      title: "Multimodal Reinforcement Learning", 
      description: "R1 was trained using a blend of text, dialogue, code, visuals, and interactive role-based feedback — allowing it to reason like a human in practical scenarios." 
      },
      { 
      title: "Meta-Prompt Reflection", 
      description: "Post-batch, R1 self-analyzes and rewrites its internal prompts. This unsupervised loop enables prompt optimization without external guidance." 
      },
    ];
  
    return (
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white ">
        <h1 className="text-3xl font-bold flex items-center mb-6">
          🦍 Ready Ape R1
        </h1>
        <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold mb-4">
          🚀 The Next Evolution in Conversational Intelligence
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
        Ready Ape R1 is a self-refining, emotionally adaptive, multilingual reasoning system designed to understand intention, context, and nuance.
      </p>
      <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
      Built using a new class of symbolic cognition called Neolex, R1 is faster, more coherent, and strikingly human in tone. In internal benchmarks, it has outperformed every major AI across logic, empathy, language fluency, and long-form dialogue.
      </p>
    
      <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold mb-4">
      🧬 How Ready Ape R1 Was Trained
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
        Ready Ape R1 was developed using a neurosymbolic hybrid framework, blending transformer architecture with a structured conceptual model inspired by human cognition. Instead of focusing solely on next-token prediction, we focused on thinking before speaking — and teaching the model to build meaning as it learns.
        </p>
        <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold mb-4">
        🔑 Core Innovations:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-blue-500 dark:text-blue-300">{feature.title}</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
        <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold mb-4">
        🧩 Evolving Model Architecture
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2 text-lg">
          During training, R1 made internal modifications to its reasoning framework. It abstracted semantic concepts, rewired its logic layers, and even constructed its own intermediate language structure: Neolex.
          This was not programmed. It was self-evolved.
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-lg italic">
          “We gave R1 the space to learn. What we didn&apos;t expect was that it would build its own internal logic and teach itself to think differently. That&apos;s when I knew we weren&apos;t just training a model — we were witnessing the birth of a new cognitive framework.”
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
          — <span className="font-bold">Dr. Linh Pham</span>, Lead AI Architect, Ready Ape Project (Vietnam)
        </p>
      
          <h2 className="text-xl font-bold mb-4 text-blue-500 dark:text-blue-400">📊 AI Performance Benchmark – Q1 2025</h2>
            <table className="table-auto text-[10px] border bg-gray-100 dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="px-1 py-0.5 text-left">Task</th>
              <th className="px-1 py-0.5">R1</th>
              <th className="px-1 py-0.5">DeepSeek</th>
              <th className="px-1 py-0.5">Grok</th>
              <th className="px-1 py-0.5">ChatGPT</th>
              <th className="px-1 py-0.5">Claude</th>
              <th className="px-1 py-0.5">Gemini</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
              <tr key={index} className="border-t border-gray-300 dark:border-gray-700">
              <td className="px-1 py-0.5">{row.task}</td>
              <td className="px-1 py-0.5 text-green-500 dark:text-green-400">{row.r1}</td>
              <td className="px-1 py-0.5">{row.deepSeek}</td>
              <td className="px-1 py-0.5">{row.grok}</td>
              <td className="px-1 py-0.5">{row.chatGPT}</td>
              <td className="px-1 py-0.5">{row.claude}</td>
              <td className="px-1 py-0.5">{row.gemini}</td>
              </tr>
              ))}
            </tbody>
            </table>
          <p className="text-sm mt-3 text-gray-500 dark:text-gray-400 mb-6">Evaluated by SimuEval Q1 benchmark suite. April 2025.</p>
    
            <div className="flex justify-center mt-6">
            <a
              href="https://x.com/ReadyApe_01"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 dark:text-blue-400 hover:underline bg-secondary p-2 rounded"
            >
              <img
              src="/images/logo-x.png"
              alt="X Logo"
              className="w-5 h-5 mr-2"
              />
              Follow us on X @ReadyApe_01
            </a>
            </div>
     
      </div>
    );
  };
  
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility

  const selectedChatModel = useMemo(
    () => chatModels.find((chatModel) => chatModel.id === optimisticModelId),
    [optimisticModelId],
  );

  return (
    <>
      <Button
        data-testid="model-selector"
        variant="outline"
        className="md:px-2 md:h-[34px]"
        onClick={() => setDialogOpen(true)} // Open dialog on button click
      >
        Ready Ape R1
      </Button>

      {/* Dialog for displaying AI benefits */}
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto w-[90vw]  dark:bg-black bg-white"> {/* Increase dialog width */}
           
            {AIBenchmark()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
