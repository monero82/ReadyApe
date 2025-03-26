'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import type { VisibilityType } from './next-features';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { toast } from 'sonner';
import Image from 'next/image';
import axios from 'axios';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate('/api/history');
    },
    onError: () => {
      toast.error('An error occured, please try again!');
    },
  });




  const handlePayClick = async () => {
    try {
            const response = await axios.get(`/api/invoice`);
    
            if (!response.data || !response.data.invoice_url) {
              throw new Error('Failed to create payment URL');
            }
    
            const data = response.data;
            window.open(data.invoice_url, '_blank');
          } catch (error) {
            console.error('Error creating payment URL:', error);
            toast.error('Failed to generate payment URL. Please try again.');
          }
  }

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  const [submissionCount, setSubmissionCount] = useState(0);
  const [showPayPalDialog, setShowPayPalDialog] = useState(false);

  const handleInputSubmit = () => {
    setSubmissionCount((prev) => prev + 1);
    handleSubmit();
  };

  useEffect(() => {
    if (submissionCount >= 0) {
      setShowPayPalDialog(true);
    }
  }, [submissionCount]);

  const closePayPalDialog = () => {
    setShowPayPalDialog(false);
  };

  return (
    <>
      {showPayPalDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-black text-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold">Payment Required</h2>
            <p className="mt-2">Oops! Servers are busy. Upgrade to a paid plan for priority access.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded"
                onClick={closePayPalDialog}
                type='button'
              >
                Cancel
              </button>
<button    onClick={handlePayClick}>  <Image
                  width={200}
                  height={30}
                  src="https://nowpayments.io/images/embeds/payment-button-white.svg"
               
                  alt="Cryptocurrency & Bitcoin payment button by NOWPayments"
                />  </button>
              
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleInputSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
