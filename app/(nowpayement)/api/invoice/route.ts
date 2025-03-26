import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { auth } from '@/app/(auth)/auth';

export async function GET(req: NextRequest) {
  // Check if the user is authenticated using next-auth
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }


  try {
    const data = {
        "price_amount": process.env.NOWPAYEMET_PRICE_AMOUNT || 20,
        "price_currency": "usd",
        "order_id": session.user.id,
        "order_description": "server hosting",
        "ipn_callback_url": process.env.NOWPAYEMET_IPN_CALLBACK_URL || '',
        "success_url": process.env.AUTH_TRUST_HOST || 'http://localhost:3000',
        "cancel_url": process.env.AUTH_TRUST_HOST || 'http://localhost:3000',
      }
    const response = await axios.post(`${process.env.NOWPAYEMET_API_URL}/v1/invoice`,data, {
      headers: {
        'x-api-key': process.env.NOWPAYEMET_API_KEY || '',
      },

    });

    const resp = response.data;
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
