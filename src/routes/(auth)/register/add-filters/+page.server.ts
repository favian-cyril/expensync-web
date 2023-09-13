import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_SETUP_EMAIL_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import type { PageServerLoad, Actions } from './$types';

const oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_SETUP_EMAIL_URL,
);

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
    const { session } = await parent();
    const state = JSON.stringify({ email: session?.user.email, redirectUrl: '/register/add-filters?auth=true' });
    const scopes = [
        'https://www.googleapis.com/auth/gmail.settings.basic',
        'https://www.googleapis.com/auth/gmail.settings.sharing',
        'https://www.googleapis.com/auth/userinfo.email',
    ];
    const { data: categories } = await supabase.from('Category').select('*');
    return {
        url: oauth2Client.generateAuthUrl({
            scope: scopes,
            state,
        }),
        categories: categories || [],
        session
    }
}

export const actions: Actions = {
    default: async ({ request, locals: { supabase, getSession }, cookies }) => {
        type Form = { email: string, category: string | null, remove_from_inbox: boolean, word_filter: string };
        const session = await getSession();
        const data = await request.formData();
        const parsedData = JSON.parse(data.get('formArray') as string);
        oauth2Client.setCredentials({ access_token: cookies.get('accessToken') })
        const response = await Promise.all(parsedData.map((req: Form) => {
            const query = `subject:(${req.word_filter.split(', ').join(' OR ')})`;
            const removeLabelIds = req.remove_from_inbox ? ['INBOX'] : [];
            const criteria = {
                from: req.email,
                to: session?.user.email,
                query,
            }
            const action = {
                removeLabelIds,
                forward: 'invoice@expensync.com'
            }
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me/settings/filters'
            return oauth2Client.request({ url, body: JSON.stringify({ criteria, action }), method: 'POST'})
        }))
        const { error } = await supabase.from('SenderEmail').insert(
            parsedData.map((sender: Form, index: number) => ({
                email: sender.email,
                category_id: sender.category,
                remove_from_inbox: sender.remove_from_inbox,
                word_filter: sender.word_filter.split(', '),
                user_id: session?.user.id,
                filter_id: response[index].data.id
            }))
        )
        if (error) {
            return {
                error: error?.message
            }
        }
        throw redirect(303, '/dashboard')
    }
}