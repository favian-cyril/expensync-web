import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase }, }) => {
    const { data } = await supabase.from('Category').select('*');
    return {
        data
    }
}

export const actions: Actions = {
    create: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession();
        if (!session) throw redirect(300, '/');
        const data = await request.formData();
        const catValue = data.get('value') as string;
        const catColor = data.get('color') as string;
        const { error } = await supabase.from('Category').insert({
            user_id: session.user.id,
            value: catValue,
            color: catColor,
        })
        if (error) {
            console.log(error);
            return { error }
        }
    },
    edit: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession();
        if (!session) throw redirect(300, '/');
        const data = await request.formData();
        const id = data.get('id') as string;
        const catValue = data.get('value') as string;
        const catColor = data.get('color') as string;
        const { error } = await supabase.from('Category').update({
            user_id: session.user.id,
            value: catValue,
            color: catColor,
        }).eq('uuid', id)
        if (error) {
            console.log(error);
            return { error }
        }
    }
}