import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession();
        const data = await request.formData();
        const categories = JSON.parse(data.get('categories') as string);
        const { error } = await supabase.from('Category').insert(
            categories.map((cat: { value: string, color: string }) => ({
                user_id: session?.user.id,
                value: cat.value,
                color: cat.color
            }))
        )
        if (error) {
            return { error: error.message }
        }
        
        throw redirect(303, '/register/setup-email')
    }
};