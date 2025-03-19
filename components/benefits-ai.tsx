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
            <p>
              Artificial Intelligence (AI) enables the automation of repetitive
              tasks, freeing up valuable time for individuals and organizations
              to focus on more strategic activities. It enhances decision-making
              by analyzing vast amounts of data and providing actionable
              insights, leading to improved efficiency and productivity.
            </p>
            <p>
              Additionally, AI excels in advanced data analysis, uncovering
              patterns and trends that might otherwise go unnoticed. It also
              facilitates personalized user experiences by tailoring
              interactions and recommendations to individual preferences, making
              technology more intuitive and user-friendly.
            </p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
