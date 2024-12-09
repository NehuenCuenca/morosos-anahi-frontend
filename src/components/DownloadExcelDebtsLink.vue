<template>
    <a :href="pathToFile" download="asd" class="month-year-separator">{{formatedMonthYearSeparator}}</a>
</template>

<script setup>
    import { computed } from 'vue';
    
    const props = defineProps({
        monthYear: String,
        defaulter_id: Number
    })

    const pathToFile = computed(() => {
        const { VITE_LOCAL_URL } = import.meta.env
        const [ year, monthNumber, monthName ] = props.monthYear.split('_')
        
        const linkToApi = new URL(`${VITE_LOCAL_URL}/api/defaulters/${props.defaulter_id}/excel-debts`);
        linkToApi.searchParams.append("year", parseInt(year));
        linkToApi.searchParams.append("month", parseInt(monthNumber));

        return linkToApi.href
    })

    const formatedMonthYearSeparator = computed(() => {
        const firstLeterToUpperCase = (word) => {
            const letterUppercased = word.substring(0,1).toUpperCase()
            return `${letterUppercased}${word.substring(1)}`
        }

        const [ year, monthNumber, monthName ] = props.monthYear.split('_')   
        return `${firstLeterToUpperCase(monthName)} (${monthNumber}/${year})`
    })
</script>

<style scoped>
    .month-year-separator{
        color: var(--color-titles);
        font: normal normal normal 1.7rem var(--display-font);
        text-align: center;
        text-decoration: underline;
        text-underline-offset: .3rem;
        padding: .3rem .5rem;
    }

@media (width >= 768px) {
    .month-year-separator{
        font: normal normal normal 2.4rem var(--display-font);
    }
}
</style>