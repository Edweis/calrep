<script lang="ts">
	import dayjs from "dayjs";
	import seasons from "./data/seasons.json";
	import feasts from "./data/feasts.json";
	import months from "./data/months.json";
	import saints from "./data/saints.json";
	let [date, time] = ["1794-01-31", "03:54:04.228Z"]; //new Date().toISOString().split("T");
	export const days = new Array(10).fill(null).map((_, i) => i + 1);
	export const decades = new Array(3).fill(null).map((_, i) => i);
	const repOrigin = dayjs("1792-09-22");
	function toRep(d: string) {
		return dayjs(d).diff(repOrigin, "days") + 1;
	}
	$: repDayNb = toRep(date); // Number of day since the begining of the Republican year
	$: isFiest = repDayNb > 360;
	$: repCount = {
		start: repDayNb,
		day: repDayNb % 30 || 30,
		decade: ((repDayNb % 30) - ((repDayNb % 30) % 10)) / 10,
		month: (repDayNb - (repDayNb % 30)) / 30,
		season: (repDayNb - (repDayNb % 90)) / 90,
		year: dayjs(date).get("year") - 1791,
	};
	function setRep(e: any) {
		const repDayNb = e.target.id.split("-")[1];
		const thisYearOrigin = repOrigin.set("year", dayjs(date).get("year"));
		const isBeforeOrigin = dayjs(date).isBefore(thisYearOrigin);
		const year = dayjs(date).get("year") + (isBeforeOrigin ? 1 : 0);
		console.log({
			thisYearOrigin,
			date,
			repOrigin,
			repDayNb,
			isBeforeOrigin,
			year,
		});
		date = repOrigin
			.set("year", dayjs(date).get("year"))
			.add(repDayNb, "days")
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
		{repDayNb} ###
		{date} ###
		{isFiest ? "" : repCount.day}
		{isFiest ? "" : months[repCount.month]}
		{isFiest ? feasts[repDayNb - 361] : ""}
		An {repCount.year} -
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
	<table class="mt-3">
		<thead>
			<tr>
				{#each feasts as _, i}
					<th class="border">Jour {i}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			<tr>
				{#each feasts as f, i}
					<td
						class="border 
						{360 + i + 1 === repCount.start ? 'bg-blue-400' : ''}"
						id="day-{360 + i + 1}"
						on:click={setRep}>{f}</td
					>
				{/each}
			</tr>
		</tbody>
	</table>
</main>
