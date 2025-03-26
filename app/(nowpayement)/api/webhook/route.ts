import crypto from 'crypto';

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
    user,
    chat,

  } from '@/lib/db/schema';



// Initialize Drizzle with Postgres
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function POST(req: Request) {
    console.log('==============new with signature');
    let data;
    try {
        data = await req.json();
    } catch (error) {
        console.error('Invalid JSON input:', error);
        return new Response('Bad Request: Invalid JSON', { status: 400 });
    }

    const signature = req.headers.get('x-nowpayments-sig');
    const secret = process.env.NOWPAYEMET_IPN_SECRET;

    if (!signature || !secret) {
        console.error('Missing signature or secret');
        return new Response('Unauthorized', { status: 401 });
    }

    const computedSignature = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(data))
        .digest('hex');

    if (computedSignature !== signature) {
        console.error('Invalid signature');
        return new Response('Unauthorized', { status: 401 });
    }

    console.log('Method: POST');
    console.log('Data:', data);
    const uid = data.order_id;

    try {
        const newDueDate = new Date();
        newDueDate.setMonth(newDueDate.getMonth() + 1); // Add 1 month to the current date

        await db
            .update(user)
            .set({ subscriptionDueDate: newDueDate })
            .where(eq(user.id, uid));

        console.log('Subscription due date updated successfully');
    } catch (error) {
        console.error('Error updating subscription due date:', error);
        return new Response('Internal Server Error', { status: 500 });
    }

    return new Response('POST request received');
}

