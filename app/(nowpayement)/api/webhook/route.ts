import crypto from 'crypto';



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
    return new Response('POST request received');
}

