<script lang="ts">
	export const seasons = ["Automne", "Hiver", "Printemps", "Été"];
	export const months = [
		"Vendémiaire",
		"Brumaire",
		"Frimaire",
		"Nivôse",
		"Pluviôse",
		"Ventôse",
		"Germinal",
		"Floréal",
		"Prairial",
		"Messidor",
		"Thermidor",
		"Fructidor",
	];
	import saints from "./data/saints.json";
	export const days = new Array(30).fill(null).map((_, i) => i + 1);
</script>

<main class=" mx-auto px-4">
	<h1 class="text-3xl text-center">Calendrier Républicain</h1>

	<h3 class="text-xl">Année</h3>
	<table class="w-full table-auto">
		<thead>
			<tr class="border-t border-b">
				<th class="border-r border-l" scope="col" />
				{#each seasons as s}
					<th class="border-r" colspan="3" scope="colgroup">{s}</th>
				{/each}
			</tr>
			<tr class="border-b">
				<th class="border-r border-l" scope="col" />
				{#each months as m}
					<th class="border-r" scope="col">{m}</th>
				{/each}
			</tr>
		</thead><tbody>
			{#each days as d}
				<tr class="border-b">
					<td class="border-r border-l">{d}</td>
					{#each months as m, mi}
						<td class="border-r">{saints[mi * 30 + d]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</main>
