import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_SETUP_EMAIL_URL } from '$env/static/private';
import { OAuth2Client } from 'google-auth-library';
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"

const oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_SETUP_EMAIL_URL,
);

export const load: PageServerLoad = async ({ parent, locals: { supabase }, cookies }) => {
    const [{ data: senderData }, {data: categoriesData }] = await Promise.all([
        supabase.from('SenderEmail').select('*, Category(value, color)'),
        supabase.from('Category').select('*'),
    ]);
    const { session } = await parent();
    const token = cookies.get('accessToken')
    const state = JSON.stringify({ redirectUrl: '/settings/sender-email?auth=true' });
    const scopes = [
        'https://www.googleapis.com/auth/gmail.settings.basic',
        'https://www.googleapis.com/auth/userinfo.email',
    ];
    const url = token ? null : oauth2Client.generateAuthUrl({
        scope: scopes,
        state,
    })
    if (token) {
        oauth2Client.setCredentials({ access_token: token })
        const url = 'https://gmail.googleapis.com/gmail/v1/users/me/settings/forwardingAddresses/invoice@expensync.com'
        try {
            await oauth2Client.request({ url, method: 'GET' });
        } catch (e) {
            return {
                error: 'Email Forwarding not yet setup. Please add the forwarding address first'
            }
        }
    }
    return {
        url,
        senderData,
        categoriesData,
        session,
    }
}

export const actions: Actions = {
    create: async ({ request, locals: { supabase, getSession }, cookies }) => {
        const session = await getSession();
        if (!session?.user?.email) throw redirect(300, '/');
        const data = await request.formData();
        const word_filter = data.get('new_word_filter') as string;
        const remove_from_inbox = data.get('new_remove_from_inbox') === 'true';
        const email = data.get('new_email') as string;
        const category = data.get('new_category') as string;
        const query = `subject:(${word_filter.split(', ').join(' OR ')})`;
        const removeLabelIds = remove_from_inbox ? ['INBOX'] : [];
        oauth2Client.setCredentials({ access_token: cookies.get('accessToken') })
        const criteria = {
            from: email,
            to: session?.user.email,
            query,
        }
        const action = {
            removeLabelIds,
            forward: 'invoice@expensync.com'
        }
        const url = 'https://gmail.googleapis.com/gmail/v1/users/me/settings/filters';
        
        const res: { data: { id: string } } = await oauth2Client.request({ url, body: JSON.stringify({ criteria, action }), method: 'POST'})
        const { error } = await supabase.from('SenderEmail').insert({
            user_id: session.user.id,
            email,
            word_filter: word_filter.split(', '),
            remove_from_inbox,
            filter_id: res.data.id,
            category_id: category === 'null' ? null : category,
            user_email: session.user.email
        })
        if (error) {
            console.log(error);
            return { error }
        }
    },
    delete: async ({ request, locals: { supabase, getSession }, cookies }) => {
        const session = await getSession();
        if (!session) throw redirect(300, '/');
        const data = await request.formData();
        const uuid = data.get('id') as string;
        const filter_id = data.get('filter_id') as string;
        oauth2Client.setCredentials({ access_token: cookies.get('accessToken') })
        const urlDelete = `https://gmail.googleapis.com/gmail/v1/users/me/settings/filters/${filter_id}`
        
        await oauth2Client.request({ url: urlDelete, method: 'DELETE' })
        const { error } = await supabase.from('SenderEmail').update({
            is_deleted: true
        }).eq('uuid', uuid)
        if (error) {
            console.log(error);
            return { error }
        }
    },
    edit: async ({ request, locals: { supabase, getSession }, cookies }) => {
        const session = await getSession();
        if (!session) throw redirect(300, '/');
        const data = await request.formData();
        const uuid = data.get('id') as string;
        const filter_id = data.get('filter_id') as string;
        const word_filter = data.get('word_filter') as string;
        const remove_from_inbox = data.get('remove_from_inbox') === 'on';
        
        const email = data.get('email') as string;
        const category = data.get('category') as string;
        const query = `subject:(${word_filter.split(', ').join(' OR ')})`;
        const removeLabelIds = remove_from_inbox ? ['INBOX'] : [];
        oauth2Client.setCredentials({ access_token: cookies.get('accessToken') })
        const criteria = {
            from: email,
            to: session?.user.email,
            query,
        }
        const action = {
            removeLabelIds,
            forward: 'invoice@expensync.com'
        }
        const url = 'https://gmail.googleapis.com/gmail/v1/users/me/settings/filters';
        const urlDelete = `https://gmail.googleapis.com/gmail/v1/users/me/settings/filters/${filter_id}`
        
        await oauth2Client.request({ url: urlDelete, method: 'DELETE' })
        const res: { data: { id: string } } = await oauth2Client.request({ url, body: JSON.stringify({ criteria, action }), method: 'POST'})
        const { error } = await supabase.from('SenderEmail').update({
            user_id: session.user.id,
            email,
            word_filter: word_filter.split(', '),
            remove_from_inbox,
            filter_id: res.data.id,
            category_id: category === 'null' ? null : category,
        }).eq('uuid', uuid)
        if (error) {
            console.log(error);
            return { error }
        }
    }
}