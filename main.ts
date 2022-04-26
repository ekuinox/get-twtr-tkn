import qs from 'qs';
import { randomBytes } from 'crypto';
import { auth } from 'twitter-api-sdk';
import { createInterface } from 'readline';
import 'dotenv/config';

const clientId = process.env['CLIENT_ID'];
const clientSecret = process.env['CLIENT_SECRET'];
const callbackUrl = process.env['CALLBACK_URL'];

if (clientId == null || clientSecret == null || callbackUrl == null) {
    process.exit(-1);
}

const scopes: auth.OAuth2Scopes[] = [
    'tweet.read',
    'users.read',
    'bookmark.read',
    'follows.read',
    'block.read',
    'like.read',
    'mute.read',
    'follows.read',
    'follows.read'
];

const client = new auth.OAuth2User({
    client_id: clientId,
    client_secret: clientSecret,
    callback: callbackUrl,
    scopes,
});

const authUrl = client.generateAuthURL({
    state: randomBytes(100).toString('hex'),
    code_challenge_method: 's256',
});
console.log(`authUrl: ${authUrl}`);
console.log('enter redirected url');

const input = createInterface({ input: process.stdin, output: process.stdout });

input.on('line', async (line) => {
    const params = qs.parse(line.split('?')[1]);
    await client.requestAccessToken(params['code'] as string);
    const header = await client.getAuthHeader();

    console.log(`Authorization: ${header.Authorization}`);
    console.log(`expires_at: ${client.expires_at}`);
});
