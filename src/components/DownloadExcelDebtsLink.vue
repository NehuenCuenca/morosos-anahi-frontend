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
        linkToApi.searchParams.append("year", year);
        linkToApi.searchParams.append("month", monthNumber);

        return linkToApi.href
    })

    const formatedMonthYearSeparator = computed(() => { 
        const [ year, monthNumber, monthName ] = props.monthYear.split('_')   
        return `${monthName} (${monthNumber}/${year})`
    })
</script>

<style scoped>
    .month-year-separator{
        color: var(--color-titles);
        font: normal normal normal 1.3rem var(--display-font);
        text-decoration: underline;
        text-underline-offset: .3rem;
        padding: .3rem .5rem;
    }
</style>