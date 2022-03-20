<script lang="ts">
	import dayjs from "dayjs";
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
	$: if (($url as any).hash !== "" && !urlDate.isValid())
		history.pushState({}, "", "/");
	$: dateTime = urlDate.isValid() ? urlDate : dayjs();
	$: [date, time] = dateTime.toISOString().split("T");
	$: inputDate,
		inputDate !== date && history.pushState({}, "", "/#/" + inputDate);
	$: inputDate = date;
	$: rep = toRep(date); // Number of day since the begining of the Republican year
	$: formated = rep.format();
	$: moveBy = (d: number) => {
		const now = dayjs(date + DEF_TIME);
		return now.add(d, "days").toISOString().split("T")[0];
	};
</script>

<main class="max-w-[640px] ssssm:container mx-auto px-4 pb-4">
	<h1 class="text-2xl text-center">Calendrier Républicain Moderne</h1>
	<div class="text-center text-2xl mt-2">
		<input type="date" id="date-greg" bind:value={inputDate} />
	</div>
	<p class="text-center text-xl mt-2">
		{formated.feast ? "" : decadeDays[formated.decadeDay - 1]}
		{formated.dayPart}<br />
		{formated.feast
			? ""
			: "décade " + (formated.decade + 1) + ", " + formated.season + ", "} An {formated.year}
	</p>
	{#if !rep.rep.feast}
		<table class="w-full mt-4">
			<thead>
				<tr><th /><th colspan="3">{months[formated.month]}</th></tr>
				<tr>
					<th class="w-1" />
					{#each decades as de}<th>Décade {de + 1}</th>{/each}
				</tr>
			</thead>
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
		</table>
	{:else}
		<table>
			<tbody>
				{#each feasts.slice(0, formated.isLeap ? undefined : -1) as f, i}
					<tr>
						<td>{i + 1}</td>
						<td class={formated.day - 1 === i && "bg-blue-500"}>
							<a href="/#/{moveBy(i - formated.day + 1)}" class="w-full block">
								{f}
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
	<div class="flex justify-between underline mt-3">
		<a
			href="/#/{formated.month === 0 ? moveBy(-formated.day) : moveBy(-30)}"
			class="block"
		>
			&lt; {formated.month === 0 ? "fêtes" : months[(formated.month || 12) - 1]}
		</a>
		<a href="/">Aujourd'hui</a>
		<a
			href="/#/{formated.month === 11
				? moveBy(30 - formated.day + 1)
				: moveBy(30)}"
			class="block"
		>
			{formated.month === 11 ? "fêtes" : months[(formated.month || -1) + 1]} &gt;
		</a>
	</div>

	<hr class="my-10" />
	<div class="max-w-[640px] text-justify">
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
