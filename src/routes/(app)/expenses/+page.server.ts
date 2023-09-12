import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import dayjs from 'dayjs';

export const load: PageServerLoad = async ({ parent, locals: { supabase }, url }) => {
    const { session } = await parent();
	if (!session) {
		throw redirect(303, '/');
	}
    const sortMapping = {
        date: 'email_created',
        vendor: 'vendor',
        amount: 'amount'
    }
    type SortMap = typeof sortMapping
    type SortKeys = keyof SortMap;
    const page: number = parseInt(url.searchParams.get('p') || '1');
    const itemsPerPage: number = parseInt(url.searchParams.get('perpage') || '10');
    const sortBy: SortKeys = url.searchParams.get('sortby') as SortKeys || 'date'
    const asc: boolean = url.searchParams.get('asc') === 'true';
    const category: string | undefined = url.searchParams.get('category') || undefined;
    const vendor: string | undefined = url.searchParams.get('vendor') || undefined;
    const sender: string | undefined = url.searchParams.get('sender') || undefined;
    const start_date: string | undefined = url.searchParams.get('start_date') || undefined;
    const end_date: string | undefined = url.searchParams.get('end_date') || undefined;
    const vendor_filter = vendor ? vendor + '%' : undefined;
    const category_filter: string[] = category ? JSON.parse(category) : [];
    const sender_filter: string[] = sender ? JSON.parse(sender) : [];
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const [
        { data: currencyData },
        { data: invoiceData },
        { data: senderData },
        { data: categoryData },
    ] = await Promise.all([
		supabase.from('User').select('currency_object').limit(1).single(),
        supabase.rpc('get_invoice_with_category_and_sender', {
            category_filter: category_filter.length > 0 ? category_filter : undefined,
            sender_filter: sender_filter.length > 0 ? sender_filter : undefined,
            vendor_filter,
            date_filter_start: start_date ? dayjs(start_date).utc().format() : undefined,
            date_filter_end: end_date ? dayjs(end_date).utc().format() : undefined,
        }).select('*')
            .order(sortMapping[sortBy], { ascending: asc })
            .range(startIndex, endIndex),
        supabase.from('SenderEmail').select('*'),
        supabase.from('Category').select('*'),
    ])
    const count = invoiceData && invoiceData[0]?.row_count;
	const currency = JSON.parse(currencyData?.currency_object || '');
    const pages = count ? Math.ceil(count / itemsPerPage) : 0;
    return {
        pages,
        currency,
        invoices: invoiceData,
        senderEmails: senderData,
        categories: categoryData,
    };
}