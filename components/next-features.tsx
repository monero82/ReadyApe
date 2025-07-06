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
    return( <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">Coming soon</h1>
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
        <DialogContent className="max-h-[80vh] overflow-y-auto w-[90vw] max-w-[1200px]  dark:bg-black bg-white">
         {nextFeatures()}
        </DialogContent>
      </Dialog>
    </>
  );
}
