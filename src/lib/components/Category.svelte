<script lang="ts">
	import colors from "tailwindcss/colors";
    export let val: { value: string, color: string | null };
</script>

<div class="rounded-full px-2 py-1 text-sm w-fit text-black h-fit" style={`background-color: ${val.color || colors.gray[500]};`}>
    {val.value}
</div>