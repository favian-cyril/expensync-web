import { redirect, type Actions } from "@sveltejs/kit";
import currencies from '@dinero.js/currencies';

export const actions: Actions = {
    default: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession();
        const data = await request.formData();
        const currency = data.get('currency')?.toString() || '';
        try {
            const currency_object = JSON.stringify(currencies[currency])
            const { error } = await supabase.from('User').upsert({
                uuid: session?.user.id,
                email: session?.user.email || '',
                first_name: data.get('firstName')?.toString() || '',
                last_name: data.get('lastName')?.toString() || '',
                currency: data.get('currency')?.toString() || '',
                currency_object,
            })
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