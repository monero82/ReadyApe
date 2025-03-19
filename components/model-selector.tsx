'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';

import { saveChatModelAsCookie } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { chatModels } from '@/lib/ai/models';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';

// Add Dialog component import
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ModelSelector({
  selectedModelId,
  className,
}: {
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
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
        The Benefits of AI
      </Button>

      {/* Dialog for displaying AI benefits */}
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Benefits of AI</DialogTitle>
            </DialogHeader>
            <ul>
              <li>1. Automation of repetitive tasks</li>
              <li>2. Enhanced decision-making</li>
              <li>3. Improved efficiency and productivity</li>
              <li>4. Advanced data analysis</li>
              <li>5. Personalized user experiences</li>
            </ul>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
