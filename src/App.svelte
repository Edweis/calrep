<script lang="ts">
	import dayjs from "dayjs";
	import seasons from "./data/seasons.json";
	import months from "./data/months.json";
	import saints from "./data/saints.json";
	let [date, time] = ["2022-07-11", "03:54:04.228Z"]; //new Date().toISOString().split("T");
	export const days = new Array(10).fill(null).map((_, i) => i + 1);
	export const decades = new Array(3).fill(null).map((_, i) => i);

	function toRep(d: string) {
		const startYear = dayjs(d).startOf("year");
		return dayjs(d).diff(startYear, "days") + 1;
	}
	$: repStart = toRep(date);
	$: repCount = {
		start: repStart,
		day: repStart % 30 || 30,
		decade: ((repStart % 30) - ((repStart % 30) % 10)) / 10,
		month: (repStart - (repStart % 30)) / 30,
		season: (repStart - (repStart % 90)) / 90,
	};
	function setRep(e) {
		const repStart = e.target.id.split("-")[1];
		date = dayjs(date)
			.startOf("year")
			.add(repStart, "days")
			.toISOString()
			.split("T")[0];
	}
	function dayCount(day: number, decade: number, monthIndex: number) {
		return monthIndex * 30 + 10 * decade + day;
	}
</script>

<main class=" mx-auto px-4">
	<h1 class="text-3xl text-center">Calendrier Républicain</h1>
	<div>
		<label for="date-greg">Date calendrier Grégorien: </label>
		<input type="date" id="date-greg" bind:value={date} />
	</div>
	<div>
		<label for="date-rep">Date calendrier Républicain: </label>
		{repCount.day}
		{months[repCount.month]} -
		{seasons[repCount.season]},
		{repCount.decade + 1} décade
	</div>
	<table class="w-full table-auto">
		<thead>
			<tr class="border-t border-b">
				<th class="border-r border-l" scope="col" />
				{#each seasons as s}
					<th class="border-r" colspan="3" scope="colgroup">{s}</th>
				{/each}
			</tr>
			<tr class="border-b border-b-black">
				<th class="border-r border-l" scope="col" />
				{#each months as m}
					<th class="border-r" scope="col">{m}</th>
				{/each}
			</tr>
		</thead>
		{#each decades as de}
			<tbody class="">
				{#each days as d}
					<tr class="border-b {d === 10 ? 'border-b-black' : ''}">
						<td class="border-r border-l border-r-black">{d + 10 * de}</td>
						{#each months as _, mi}
							<td
								id="day-{mi * 30 + 10 * de + d}"
								on:click={setRep}
								class="border-r 
									{!((mi % 3) - 2) ? 'border-r-black' : ''} 
									{dayCount(d, de, mi) === repCount.start ? 'bg-blue-400' : ''}
								"
							>
								{saints[dayCount(d, de, mi) - 1]}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		{/each}
	</table>
</main>
