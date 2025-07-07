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
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

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

  const [payLoading, setPayLoading] = useState(false);

  const handlePayClick = async () => {
    setPayLoading(true);
    try {
      const response = await axios.get(`/api/invoice`);

      if (!response.data || !response.data.invoice_url) {
        throw new Error('Failed to create payment URL');
      }

      const data = response.data;
      window.location.href = data.invoice_url;
    } catch (error) {
      console.error('Error creating payment URL:', error);
      toast.error('Failed to generate payment URL. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

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

  // Disabled subscriptionDueDate check due to missing property on User type
  // useEffect(() => {
  //   if (submissionCount >= 3 && ( !session?.user?.subscriptionDueDate || new Date(session.user.subscriptionDueDate) < new Date())) {
  //     setShowPayPalDialog(true);
  //   }
  // }, [submissionCount]);

  const closePayPalDialog = () => {
    setShowPayPalDialog(false);
  };

  const { data: session } = useSession();

  // Event modal state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showViewEvents, setShowViewEvents] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPhotoUrl, setEventPhotoUrl] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState('');
  const [events, setEvents] = useState<any[]>([]);

  // Add Event handler
  const handleAddEvent = async () => {
    setEventLoading(true);
    setEventError('');
    try {
      const res = await fetch(`${API_BASE}/events/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session?.user?.id,
          title: eventTitle,
          description: eventDescription,
          photo_url: eventPhotoUrl,
          event_time: eventTime || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to add event');
      setShowAddEvent(false);
      setEventTitle('');
      setEventDescription('');
      setEventPhotoUrl('');
      setEventTime('');
      toast.success('Event added!');
    } catch (e: any) {
      setEventError(e.message);
    } finally {
      setEventLoading(false);
    }
  };

  // View Events handler
  const handleViewEvents = async () => {
    setEventLoading(true);
    setEventError('');
    try {
      const res = await fetch(`${API_BASE}/events/?user_id=${session?.user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data.events || []);
      setShowViewEvents(true);
    } catch (e: any) {
      setEventError(e.message);
    } finally {
      setEventLoading(false);
    }
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
              <button
                onClick={handlePayClick}
                disabled={payLoading}
              >
                <Image
                  width={200}
                  height={30}
                  src="https://nowpayments.io/images/embeds/payment-button-white.svg"
                  alt="Cryptocurrency & Bitcoin payment button by NOWPayments"
                />
              </button>
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

      <div className="flex flex-row gap-2 justify-end px-4 pt-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddEvent(true)}
        >
          Add Event
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleViewEvents}
        >
          View My Events
        </button>
      </div>

      {/* Add Event Modal */}
      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Title"
              value={eventTitle}
              onChange={e => setEventTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={eventDescription}
              onChange={e => setEventDescription(e.target.value)}
            />
            <Input
              placeholder="Photo URL"
              value={eventPhotoUrl}
              onChange={e => setEventPhotoUrl(e.target.value)}
            />
            <Input
              type="datetime-local"
              placeholder="Event Time"
              value={eventTime}
              onChange={e => setEventTime(e.target.value)}
            />
            {eventError && <div className="text-red-500 text-sm">{eventError}</div>}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
              onClick={handleAddEvent}
              disabled={eventLoading}
            >
              {eventLoading ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Events Modal */}
      <Dialog open={showViewEvents} onOpenChange={setShowViewEvents}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>My Events</DialogTitle>
          </DialogHeader>
          {eventLoading ? (
            <div>Loading...</div>
          ) : eventError ? (
            <div className="text-red-500">{eventError}</div>
          ) : events.length === 0 ? (
            <div>No events found.</div>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {events.map(ev => (
                <li key={ev.id} className="border rounded p-2">
                  <div className="font-bold">{ev.title}</div>
                  <div>{ev.description}</div>
                  {ev.photo_url && <img src={ev.photo_url} alt="event" className="w-32 h-20 object-cover mt-1" />}
                  <div className="text-xs text-gray-500 mt-1">{ev.event_time ? new Date(ev.event_time).toLocaleString() : ''}</div>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
