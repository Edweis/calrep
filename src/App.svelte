<script lang="ts">
	import dayjs from "dayjs";
	import seasons from "./data/seasons.json";
	import feasts from "./data/feasts.json";
	import months from "./data/months.json";
	import saints from "./data/saints.json";
	import { toRep } from "./compute";
	import url from "./url";
	const DEF_TIME = "T00:00:00.001Z";
	$: urlDate = dayjs(($url as any).hash.replace(/^#\//, "").concat(DEF_TIME));
	$: dateTime = urlDate.isValid() ? urlDate : dayjs();
	$: [date, time] = dateTime.toISOString().split("T");
	export const days = new Array(10).fill(null).map((_, i) => i + 1);
	export const decades = new Array(3).fill(null).map((_, i) => i);
	$: year = dayjs(date + DEF_TIME).get("year");
	$: rep = toRep(date); // Number of day since the begining of the Republican year
	$: formated = rep.format();
	$: console.log({ date });
	function toGreg(d: number) {
		return dayjs(year + "-09-22" + DEF_TIME)
			.add(d - 1, "days")
			.toISOString()
			.split("T")[0];
	}
	function setGreg(e: any) {
		const repDayNb = e.target.id.split("-")[1];
		date = toGreg(repDayNb);
	}
	function dayCount(day: number, decade: number, monthIndex: number) {
		return monthIndex * 30 + 10 * decade + day;
	}
</script>

<main class="px-4">
	<h1 class="text-3xl text-center">Calendrier Républicain Moderne</h1>
	<div class="container mx-auto p-4">
		Ce calendrier est inspiré du <a
			href="https://fr.wikipedia.org/wiki/Calendrier_r%C3%A9publicain"
			class="underline hover:text-blue-500">calendrier républicain</a
		>
		en imposant le premier jour de l'année au 22 Septembre afin de coïncider avec
		les années bisextiles du calendrier Grégorien. Ainsi ce calendrier
		<b>ne correspond pas au calendrier républicain de 1791-1805</b> mais représente
		une version moderne, alternative au calendrier grégorien.
	</div>
	<div>
		<label for="date-greg">Date calendrier Grégorien: </label>
		<input type="date" id="date-greg" bind:value={date} />
	</div>
	<div>
		<label for="date-rep">Date calendrier Républicain: </label>
		{formated.dayPart}
		An {formated.year}
		{formated.feast
			? ""
			: " - " + formated.season + ", " + (formated.decade + 1) + " décade"}
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
								class="border-r 
									{!((mi % 3) - 2) ? 'border-r-black' : ''} 
									{dayCount(d, de, mi) === formated.dayNumber ? 'bg-blue-400' : ''}
								"
							>
								<a href="/#/{toGreg(dayCount(d, de, mi))}">
									{saints[dayCount(d, de, mi) - 1]}
								</a>
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
						{360 + i + 1 === formated.dayNumber ? 'bg-blue-400' : ''}"
					>
						<a href="/#/{toGreg(360 + i + 1)}">
							{f}
						</a>
					</td>
				{/each}
			</tr>
		</tbody>
	</table>
</main>
