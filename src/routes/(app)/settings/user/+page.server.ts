import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }}) => {
    const { data: userData } = await supabase.from('User').select('*')
    return {
        userData: userData?.at(0)
    };
};

export const actions: Actions = {
    default: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession();
        const data = await request.formData();
        try {
            const { error } = await supabase.from('User').update({
                first_name: data.get('firstName')?.toString() || '',
                last_name: data.get('lastName')?.toString() || '',
                save_email_content: Boolean(data.get('save_email_content')),
            }).eq('uuid', session?.user.id)
            if (error) return {
                error: error.message
            }
        } catch (error) {
            return {
                error
            }
        }
    }
};