import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dinero, toDecimal } from 'dinero.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { formatDinero } from '../../../lib/utils/currency';

dayjs.extend(utc);

export const load: PageServerLoad = async ({ parent, locals: { supabase }, url }) => {
	const { session } = await parent();
	if (!session) {
		throw redirect(303, '/');
	}
	const startDate = dayjs().startOf(url.searchParams.get('range') || 'week').utc().format();
	
	const today = dayjs().utc().format();
	const [
		{ data: currencyData },
		{ data: totalRaw },
		{ data: avgRaw },
		{ data: pieChartRaw },
		{ data: lineChartRaw },
		{ count: notValidatedCount},
		{ count: totalCount }
	] = await Promise.all([
		supabase.from('User').select('currency_object').limit(1).single(),
		supabase.rpc('calculate_total_invoice_amount', { after_date: startDate }),
		supabase.rpc('calculate_average_amount_in_date_range', { start_date: startDate, end_date: today }),
		supabase.rpc('calculate_total_invoice_amount_by_category', { after_date: startDate }).select('*'),
		supabase.rpc('get_invoice_line_graph_data', { after_date: startDate }),
		supabase.from('Invoice').select('*', { count: 'exact', head: true }).eq('is_valid', false),
		supabase.from('Invoice').select('*', { count: 'exact', head: true }).gt('created_at', startDate),
	])
	const currency = JSON.parse(currencyData?.currency_object || '');
	const totalAmount = dinero({ amount: totalRaw || 0, currency })
	const avgAmount = dinero({ amount: Math.floor(avgRaw as number) || 0, currency })
	return {
		totalAmount: formatDinero(totalAmount),
		avgAmount: formatDinero(avgAmount),
		pieChartData: pieChartRaw?.map(val => ({ ...val, total_amount: toDecimal(dinero({ amount: val.total_amount, currency })) })),
		lineChartData: lineChartRaw?.map(val => ({ ...val, total_amount: toDecimal(dinero({ amount: val.total_amount, currency })) })),
		count: notValidatedCount,
		totalCount,
		user: session.user,
	};
};
