<script lang="ts">
	import type { PageData } from "./$types";
	import Chart from 'chart.js/auto';
	import { afterUpdate } from "svelte";
    import { queryParam } from "sveltekit-search-params";
	import colors from "tailwindcss/colors";
	
	export let data: PageData;
	let pieChartCanvas: HTMLCanvasElement;
	let lineChartCanvas: HTMLCanvasElement;
	let pieChart: Chart<"doughnut", string[] | undefined, string>;
	let lineChart: Chart<"line", string[] | undefined, string>;
	const tab = queryParam('range', {
		encode: (val: string) => val,
        decode: (val: string | null) => val,
        defaultValue: 'week',
	})
	afterUpdate(() => {
		if (pieChart) pieChart?.destroy();
		if (lineChart) lineChart?.destroy();
		const ctxPie = pieChartCanvas.getContext('2d')
		if (ctxPie) {
			pieChart = new Chart(ctxPie, {
				type: 'doughnut',
				data: {
					labels: data.pieChartData?.map(val => val.category_name),
					datasets: [{
						label: 'Amount',
						data: data.pieChartData?.map(val => val.total_amount),
						backgroundColor: data.pieChartData?.map(val => val.category_color || '#666666'),
						hoverOffset: 4
					}],
				}
			});
		}
		const ctxLine = lineChartCanvas.getContext('2d');
		if (ctxLine) {
			lineChart = new Chart(ctxLine, {
				type: 'line',
				data: {
					labels: data.lineChartData?.map(val => val.invoice_date),
					datasets: [{
						label: 'Expenses over time',
						data: data.lineChartData?.map(val => val.total_amount),
						fill: false,
						borderColor: colors.blue[500],
						tension: 0.05
					}]
				}
			})
		}
	})
	const increasePercent = (data.comparisonPercent - 1) * 100;
</script>

<div class="flex flex-col mx-auto xl:w-3/4 w-full p-2 xl:p-0 gap-2 mb-5">
	<div class="tabs">
		<a class={`tab md:tab-lg tab-sm tab-bordered ${$tab === 'week' ? 'tab-active' : ''}`} href="/dashboard?range=week">This Week</a> 
		<a class={`tab md:tab-lg tab-sm tab-bordered ${$tab === 'month' ? 'tab-active' : ''}`} href="/dashboard?range=month">This Month</a> 
		<a class={`tab md:tab-lg tab-sm tab-bordered ${$tab === 'year' ? 'tab-active' : ''}`} href="/dashboard?range=year">This Year</a>
	</div>
		{#if data.count}
			<div class="alert">
				<span><i class="fa-solid fa-circle-info"></i>{data.count} unreviewed expenses.<a href="/review" class="underline">Review Now<i class="fa-solid fa-arrow-right ml-0.5"></i></a></span>
			</div>
		{/if}
		<div class="stats md:stats-horizontal stats-vertical shadow-md md:flex">
			<div class="stat p-2">
			  <div class="stat-title">Total Expenses</div>
			  <div class="stat-value">{data.totalAmount}</div>
			</div>
			<div class="stat p-2">
				<div class="stat-title">Average Expense</div>
				<div class="stat-value">{data.avgAmount}</div>
				<div class="stat-desc">
					{`Last ${$tab} avg: ${data.lastAvg}`}
					<span class={data.comparisonPercent > 1 ? `text-red-500` : `text-green-500`}>{data.comparisonPercent > 1 ? `${increasePercent.toFixed(2)}% ↗︎` : `${parseFloat(data.comparisonPercent.toFixed(2)) * 100}% ↘︎`}</span>
				</div>
			</div>
			<div class="stat p-2">
				<div class="stat-title">Total Expenses</div>
				<div class="stat-value">{data.totalCount}</div>
			</div>
		</div>
	<div class="flex md:flex-row flex-col w-full gap-2">
		<div class="stats shadow-md md:w-4/12 w-full">
			<div class="stat w-fit p-2">
				<canvas bind:this={pieChartCanvas} class="mx-auto lg:h-72 md:h-44" id="pieChart"></canvas>
			</div>
		</div>
		<div class="stats shadow-md md:w-8/12 w-full">
			<div class="stat w-full p-2">
				<canvas bind:this={lineChartCanvas} class="lg:h-64 md:h-30 md:w-96 lg:w-auto" id="lineChart"></canvas>
			</div>
		</div>
	</div>
</div>
