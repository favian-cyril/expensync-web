import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ parent, locals: { supabase }, }) => {
    const { session } = await parent();
	if (!session) {
		throw redirect(303, '/');
	}

    const [
        { data: currencyData },
        { data: invoiceData },
        { data: categories }
    ] = await Promise.all([
		supabase.from('User').select('currency_object').limit(1).single(),
        supabase.from('Invoice').select('*, Category(*), SenderEmail(email)').eq('is_valid', false).order('created_at', { ascending: false }),
        supabase.from('Category').select('*'),
    ])
    const currency = JSON.parse(currencyData?.currency_object || '');
    return {
        currency,
        invoices: invoiceData?.map(val => ({
            ...val,
            other_amounts: new Set(val.other_amounts.filter(i => !!i))
        })),
        categories,
    };
}

export const actions: Actions = {
    default:async ({ request, locals: { supabase } }) => {
        type FormItem = { uuid: string, category_id: string | null, email_content: string, SenderEmail: { email: string } | null, vendor: string, created_at: string | null, amount: string, other_amounts: string[] };
        const data = await request.formData();
        const parsedData = JSON.parse(data.get('data') as string);
        const deletedData = JSON.parse(data.get('deleted') as string);
        try {
            await Promise.all(parsedData.map((data: FormItem) => (
                supabase.from('Invoice').update({ vendor: data.vendor, category_id: data.category_id, amount: parseInt(data.amount), is_valid: true }).eq('uuid', data.uuid)
            )));
        } catch (e) {
            console.log(e);
        }
        
        if (deletedData.length > 0) {
            await supabase.from('Invoice').update({ is_deleted: true }).in('uuid', deletedData.map((i: FormItem) => i.uuid))
        }
    }
}