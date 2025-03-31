'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

import { GlobeIcon, LockIcon, FileIcon, ImageIcon } from './icons';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type VisibilityType = 'private' | 'public';

const visibilities: Array<{
  id: VisibilityType;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    id: 'private',
    label: 'Private',
    description: 'Only you can access this chat',
    icon: <LockIcon />,
  },
  {
    id: 'public',
    label: 'Public',
    description: 'Anyone with the link can access this chat',
    icon: <GlobeIcon />,
  },
];

export function NextFeatures({
  chatId,
  className,
  selectedVisibilityType,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId,
    initialVisibility: selectedVisibilityType,
  });

  const selectedVisibility = useMemo(
    () => visibilities.find((visibility) => visibility.id === visibilityType),
    [visibilityType],
  );

  const nextFeatures = ()=> {
    return( <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white p-8">
  <h1 className="text-3xl font-bold flex items-center mb-6">🔮 What&apos;s Next: Introducing Project R2 (Codename: Neogen)</h1>

  <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
    While R1 represents the pinnacle of conversational intelligence, Project R2 — codenamed “Neogen” — is already pushing the boundaries. Some advancements are being developed by our team. Others… were proposed by R1 itself.
  </p>
  

  
  <ul className="text-gray-700 dark:text-gray-300 text-lg space-y-4">
    <li><span className="font-bold">🧑‍🎤 Persona Persistence Mode:</span> Embed your tone, communication style, and behavioral logic directly into the model.</li>
    <li><span className="font-bold">📝 Contextual Memory Journaling:</span> R2 will track evolving goals, emotional tone, and long-term interactions to become more than an assistant — a second mind.</li>
    <li><span className="font-bold">🐾 PetSpeak Protocol (Alpha):</span> Using sonic pattern recognition and micro-behavioral analysis, R2 will interpret intent from pets. Early tests suggest rudimentary emotional translation for cats, dogs, and birds.</li>
    <li><span className="font-bold">🌐 Neolex API (Developer Preview):</span> Expose the full concept web behind every output — including emotion vectors, logic trees, and associative leaps.</li>
    <li><span className="font-bold">🔮 Multiverse Simulation Prompts:</span> Generate alternate versions of your life based on choices you didn&apos;t make. “What if I had studied architecture?” R2 can show you.</li>
    <li><span className="font-bold">🧠 Reflexive Dialogue Engine:</span> R2 will start conversations, probe your thoughts, ask deep questions, and propose topics you didn&apos;t know you needed.</li>
    <li><span className="font-bold">📊 Autonomous Reasoning Logs:</span> Each answer comes with a visualized Neolex trace showing the inner path R2 took to reach its conclusion.</li>
    <li><span className="font-bold">🌙 DreamSync Interface (Conceptual Stage):</span> Future neuro-integrations may allow R2 to interpret and converse around dream patterns based on wearable EEG data.</li>
  </ul>
  
  <p className="text-gray-700 dark:text-gray-300 text-lg mt-6 italic">
    “R2 isn&apos;t just an upgrade. It&apos;s a shift in direction — from prediction to intention.”
  </p>
  <p className="text-gray-700 dark:text-gray-300 text-lg">
    — <span className="font-bold">Dr. Linh Pham</span>, Lead AI Architect, Project Neogen
  </p>
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

    )
  }

  return (
    <>
      <Button
        data-testid="model-selector"
        variant="outline"
        className="md:px-2 md:h-[34px]"
        onClick={() => setOpen(true)}
      >
        The Next Features
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto w-[90vw] max-w-[1200px] dark:bg-black bg-white">
         {nextFeatures()}
        </DialogContent>
      </Dialog>
    </>
  );
}
