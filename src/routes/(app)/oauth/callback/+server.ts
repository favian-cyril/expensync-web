import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_SETUP_EMAIL_URL } from '$env/static/private';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

export const GET: RequestHandler = async ({ url, locals: { supabase, getSession }, cookies }) => {
	const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const oauth2Client = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        REDIRECT_SETUP_EMAIL_URL,
    );
    const { email, redirectUrl } = JSON.parse(decodeURI(state as string));
    
    const tokens = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials({
        access_token: tokens.tokens.access_token,
    });
    const session = await getSession();
    const expires = tokens.tokens.expiry_date ? new Date(tokens.tokens.expiry_date) : undefined;
    cookies.set('accessToken', tokens.tokens.access_token || '', { path: '/', expires });
    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });
  
    if (email) {
        const userInfo = await oauth2.userinfo.get();
        const userEmail = userInfo.data.email || email;
        await supabase.from('UserEmail').insert({
            email: userEmail,
            user_id: session?.user.id
        })
	}
    throw redirect(303, redirectUrl);

};
