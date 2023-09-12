<script lang="ts">
    import colors from 'tailwindcss/colors';
	import type { DefaultColors } from 'tailwindcss/types/generated/colors';
    export let newColor = '';
    export let name = '';
    const excludedColors = [
        'slate', 'gray', 'zinc', 'neutral',
        'stone', 'black', 'white', 'transparent',
        'inherit', 'current', 'warmGray', 'trueGray',
        'coolGray', 'blueGray', 'lightBlue'
    ] as const;
    type ExcludedColors = typeof excludedColors[number];
    type ColorKeys = keyof DefaultColors;
    type OmittedColorsKeys = Exclude<ColorKeys, ExcludedColors>;
    const colorSelections: OmittedColorsKeys[] = Object.keys(colors).filter(col => !excludedColors.includes(col as ExcludedColors)) as OmittedColorsKeys[];
</script>

<select bind:value={newColor} name={name} class="select select-bordered text-black" style={`background-color: ${newColor};`}>
    <option disabled selected value="">Select Color</option>
    {#each colorSelections as col}
        <option value={colors[col][500]}>{col}</option>
    {/each}
</select>