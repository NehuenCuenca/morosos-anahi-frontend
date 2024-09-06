<template>
    <ul class="balances-list">
        <li class="balance-item total-balance negative-balance">SALDO: ${{balances.total}}</li>
        <li class="balance-item negative-balance">NEGATIVO: ${{balances.negative}}</li>
        <li class="balance-item positive-balance">A FAVOR: ${{balances.positive}}</li>
    </ul>
</template>

<script setup>

    const props = defineProps({
        balances: Object,
    })

</script>

<style scoped>
.balances-list{
    margin: 1rem 0 0 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.balance-item{
    font: normal normal normal 1.5rem var(--default-font);
}
.total-balance{}

</style>