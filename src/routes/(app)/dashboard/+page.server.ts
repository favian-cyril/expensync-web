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
	const { data: currencyData } = await supabase.from('User').select('currency_object').limit(1).single();
	if (!currencyData?.currency_object) {
		throw redirect(303, '/register');
	}
	const currency = JSON.parse(currencyData?.currency_object || '');
	const totalAmount: Promise<string> = new Promise((resolve) => {
		supabase.rpc('calculate_total_invoice_amount', { after_date: startDate }).then(res => {
			resolve(formatDinero(dinero({ amount: res.data || 0, currency })))
		})
	})
	const avgAmount: Promise<string> = new Promise((resolve) => {
		supabase.rpc('calculate_average_amount_in_date_range', { start_date: startDate, end_date: today }).then(res => {
			resolve(formatDinero(dinero({ amount: Math.floor(res.data as number) || 0, currency })))
		})
	})
	const lastAvg: Promise<string> = new Promise((resolve) => {
		supabase.rpc('calculate_average_amount_in_date_range', { start_date: comparisonDate, end_date: startDate }).then(res => {
			resolve(formatDinero(dinero({ amount: Math.floor(res.data as number) || 0, currency })))
		})
	})
	const pieChartData: Promise<{category_name: string, total_amount: string, category_color: string}[]> = new Promise((resolve) => {
		supabase.rpc('calculate_total_invoice_amount_by_category', { after_date: startDate }).select('*').then(res => {
			resolve(res.data?.map(val => ({ ...val, total_amount: toDecimal(dinero({ amount: val.total_amount, currency })) })) || [])
		})
	})
	const lineChartData: Promise<{total_amount: string, invoice_date: string}[]> = new Promise((resolve) => {
		supabase.rpc('get_invoice_line_graph_data', { after_date: startDate }).then(res => {
			resolve(res.data?.map(val => ({ ...val, total_amount: toDecimal(dinero({ amount: val.total_amount, currency })) })) || [])
		})
	})
	const count: Promise<number> = new Promise((resolve) => {
		supabase.from('Invoice').select('*', { count: 'exact', head: true }).eq('is_valid', false).eq('is_deleted', false).then(res => {
			resolve(res.count || 0)
		})
	})
	const totalCount: Promise<number> = new Promise((resolve) => {
		supabase.from('Invoice').select('*', { count: 'exact', head: true }).gt('created_at', startDate).eq('is_deleted', false).then(res => {
			resolve(res.count || 0)
		})
	})
	
	const comparisonPercent: Promise<number> = new Promise((resolve) => {
		supabase.rpc('calculate_average_amount_in_date_range', { start_date: startDate, end_date: today }).then(res => {
			supabase.rpc('calculate_average_amount_in_date_range', { start_date: comparisonDate, end_date: startDate }).then(resLast => {
				const avgNumber = res.data || 0;
				const lastAvgNumber = res.data || 0;
				const percentIncrease = avgNumber && lastAvgNumber ? avgNumber / lastAvgNumber : 0;
				resolve(percentIncrease)
			})
		})
	})
	return {
		totalAmount,
		avgAmount,
		pieChartData,
		lineChartData,
		count,
		totalCount,
		user: session.user,
		comparisonPercent,
		lastAvg
	};
};
