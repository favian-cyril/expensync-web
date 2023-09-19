import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dinero, toDecimal } from 'dinero.js';
import dayjs, { type OpUnitType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { formatDinero } from '../../../lib/utils/currency';

dayjs.extend(utc);

export const load: PageServerLoad = async ({ parent, locals: { supabase }, url }) => {
	const { session } = await parent();
	if (!session) {
		throw redirect(303, '/login');
	};
	const startOfRange = url.searchParams.get('range') || 'week';
	const startDate = dayjs().startOf(startOfRange).utc().format();
	const comparisonDate = dayjs().startOf(startOfRange).subtract(1, startOfRange).utc().format();
	
	const today = dayjs().utc().format();
	const [
		{ data: currencyData },
		{ data: totalRaw },
		{ data: avgRaw },
		{ data: avgLast },
		{ data: pieChartRaw },
		{ data: lineChartRaw },
		{ count: notValidatedCount},
		{ count: totalCount }
	] = await Promise.all([
		supabase.from('User').select('currency_object').limit(1).single(),
		supabase.rpc('calculate_total_invoice_amount', { after_date: startDate }),
		supabase.rpc('calculate_average_amount_in_date_range', { start_date: startDate, end_date: today }),
		supabase.rpc('calculate_average_amount_in_date_range', { start_date: comparisonDate, end_date: startDate }),
		supabase.rpc('calculate_total_invoice_amount_by_category', { after_date: startDate }).select('*'),
		supabase.rpc('get_invoice_line_graph_data', { after_date: startDate }),
		supabase.from('Invoice').select('*', { count: 'exact', head: true }).eq('is_valid', false).eq('is_deleted', false),
		supabase.from('Invoice').select('*', { count: 'exact', head: true }).gt('created_at', startDate).eq('is_deleted', false),
	])
	if (!currencyData?.currency_object) {
		throw redirect(303, '/register');
	}
	const currency = JSON.parse(currencyData?.currency_object || '');
	const totalAmount = dinero({ amount: totalRaw || 0, currency })
	const comparisonPercent = avgLast && avgRaw ? avgRaw / avgLast : 0;
	const avgAmount = dinero({ amount: Math.floor(avgRaw as number) || 0, currency })
	const lastAvg = dinero({ amount: Math.floor(avgLast as number) || 0, currency })
	return {
		totalAmount: formatDinero(totalAmount),
		avgAmount: formatDinero(avgAmount),
		pieChartData: pieChartRaw?.map(val => ({ ...val, total_amount: toDecimal(dinero({ amount: val.total_amount, currency })) })),
		lineChartData: lineChartRaw?.map(val => ({ ...val, total_amount: toDecimal(dinero({ amount: val.total_amount, currency })) })),
		count: notValidatedCount,
		totalCount,
		user: session.user,
		comparisonPercent,
		lastAvg: formatDinero(lastAvg)
	};
};
