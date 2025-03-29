'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from '@/components/toast';
import { signIn } from 'next-auth/react';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { login, type LoginActionState } from '../actions';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast({
        type: 'error',
        description: 'Invalid credentials!',
      });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
  
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-4">

      <div className="size-70 rounded-full border-2 border-white flex items-center justify-center mx-auto">
          <Image
        src="/images/logo_all.png"
        alt="ready ape Logo"
        width={250}
        height={250}
        className="rounded-full"
          />
         
          </div>

          <div className="text-center mt-4">
            <p className="text-sm  mb-3 dark:text-white">A chatbot AI that answers every request</p></div>

       
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
        </AuthForm>
        <div className="flex flex-col justify-center gap-2 px-4 text-center sm:px-16">
          <Button
            onClick={() => {
              setIsSuccessful(false);
              signIn('google');
            }}
          >
            <Image
              src="/images/google-logo.png"
              alt="Google Logo"
              width={20}
              height={20}
            />
            Sign in with Google
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign up
            </Link>
            {' for free.'}
          </p>
        </div>
      </div>
    </div>
  );
}
