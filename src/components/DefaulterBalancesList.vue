<template>
    <ul class="balances-list">
        <li class="balance-item total-balance negative-balance">SALDO: $300</li>
        <li class="balance-item negative-balance">NEGATIVO: $600</li>
        <li class="balance-item positive-balance">A FAVOR: $300</li>
    </ul>
</template>

<script setup>

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