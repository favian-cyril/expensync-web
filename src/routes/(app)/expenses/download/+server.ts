import dayjs from 'dayjs';
import type { RequestHandler } from './$types';
import Papa from 'papaparse';
import { dinero } from 'dinero.js';
import { formatDinero } from '$lib/utils/currency';

const sortMapping = {
    date: 'email_created',
    vendor: 'vendor',
    amount: 'amount'
}
type SortMap = typeof sortMapping
type SortKeys = keyof SortMap;

export const GET: RequestHandler = async ({ url, locals: { supabase }}) => {
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
        const [{ data: currencyData }, { data: invoicesData }] = await Promise.all([
            supabase.from('User').select('currency_object').limit(1).single(),
            supabase.rpc('get_invoice_with_category_and_sender', {
                category_filter: category_filter.length > 0 ? category_filter : undefined,
                sender_filter: sender_filter.length > 0 ? sender_filter : undefined,
                vendor_filter,
                date_filter_start: start_date ? dayjs(start_date).utc().format() : undefined,
                date_filter_end: end_date ? dayjs(end_date).utc().format() : undefined,
            }).select('email_created,sender_email,vendor,category,amount')
                .order(sortMapping[sortBy], { ascending: asc })
        ])
	    const currency = JSON.parse(currencyData?.currency_object || '');
        const data = invoicesData?.map(inv => ({
            ...inv,
            amount: formatDinero(dinero({ amount: inv.amount, currency }))
        })) || []
        const responseBody = Papa.unparse(data, {
            header: true
        })
        const name = dayjs().format('[Expenses]_DD-MM-YYYY_HH.mm.ss');
        return new Response(
            responseBody,
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition':
                        // Use filename* instead of filename to support non-ASCII characters
                        `attachment;filename=${encodeURIComponent(name)}.csv`,
                },
            }
        );
};