<script lang="ts">
	import dayjs from "dayjs";
	import seasons from "./data/seasons.json";
	import feasts from "./data/feasts.json";
	import months from "./data/months.json";
	import saints from "./data/saints.json";
	import decadeDays from "./data/dayOfDecade.json";
	import { toRep } from "./compute";
	import url from "./url";
	const DEF_TIME = "T00:00:00.001Z";
	export const days = new Array(10).fill(null).map((_, i) => i + 1);
	export const decades = new Array(3).fill(null).map((_, i) => i);

	$: urlDate = dayjs(($url as any).hash.replace(/^#\//, "").concat(DEF_TIME));
	$: dateTime = urlDate.isValid() ? urlDate : dayjs();
	$: [date, time] = dateTime.toISOString().split("T");
	$: year = dayjs(date + DEF_TIME).get("year");
	$: rep = toRep(date); // Number of day since the begining of the Republican year
	$: formated = rep.format();
	$: console.log({ date });
	$: moveBy = (d: number) => {
		const now = dayjs(date + DEF_TIME);
		return now.add(d, "days").toISOString().split("T")[0];
	};
</script>

<main class="px-4">
	<h1 class="text-2xl text-center">Calendrier Républicain Moderne</h1>
	<div class="container text-center text-2xl mt-2">
		<input type="date" id="date-greg" bind:value={date} />
	</div>
	<p>{JSON.stringify(formated, null, "  ")}</p>
	<p>{formated.decade}/{formated.decadeDay}</p>
	<p class="container text-center text-xl mt-2">
		{formated.feast ? "" : decadeDays[formated.decadeDay - 1]}
		{formated.dayPart}<br />
		{formated.feast
			? ""
			: "décade " + (formated.decade + 1) + ", " + formated.season}, An {formated.year}
	</p>
	<table class="w-full mt-4">
		<thead>
			<tr><th /><th colspan="3">{months[formated.month]}</th></tr>
			<tr>
				<th class="w-1" />
				{#each decades as de}<th>Décade {de + 1}</th>{/each}
			</tr>
		</thead>
		{#if !rep.rep.feast}
			<tbody>
				{#each days as d}
					<tr>
						<td class="text-right">{decadeDays[d - 1]}</td>
						{#each decades as de}
							<td
								class="text-center 
								{de === formated.decade && d === formated.decadeDay && 'bg-blue-500'}"
							>
								<a
									href="/#/{moveBy(
										de * 10 + d - formated.decade * 10 - formated.decadeDay
									)}"
									class="w-full block"
								>
									{saints[formated.month * 30 + de * 10 + d - 1]}
								</a>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
	<div class="flex justify-between underline mt-3">
		<a
			href="/#/{formated.month === 0 ? moveBy(-formated.day) : moveBy(-30)}"
			class="block"
			>&lt; {formated.month === 0 ? "fêtes" : months[formated.month - 1]}</a
		>
		<a href="/#/{moveBy(30)}" class="block">{months[formated.month + 1]} &gt;</a
		>
	</div>
	<!-- <table class="hidden w-full table-auto">
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
	<table class="hidden mt-3">
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
	</table> -->
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
</main>
