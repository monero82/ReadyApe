import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import axios from 'axios';
import { authConfig } from '@/app/(auth)/auth.config';


export async function GET(req: NextRequest) {
  // Check if the user is authenticated using next-auth
  const session = await getServerSession(authConfig);

  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

console.log('====' ,  process.env.NOWPAYEMET_API_KEY);



  try {
    const data = {
        "price_amount": process.env.NOWPAYEMET_PRICE_AMOUNT || 20,
        "price_currency": "usd",
        "order_id": "RGDBP-21314dsfa",
        "order_description": "server hosting",
        "ipn_callback_url": process.env.NOWPAYEMET_IPN_CALLBACK_URL || '',
        "success_url": "https://google.com",
        "cancel_url": "https://youtube.com"
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
