<template>
    <ul class="balances-list">
        <li class="balance-item" :class="(total_balance > 0) ? 'debt_balance' : 'discount_balance'">SALDO: ${{total_balance}}</li>
        <li class="balance-item debt_balance">NEGATIVO: ${{debt_balance}}</li>
        <li class="balance-item discount_balance">A FAVOR: ${{discount_balance}}</li>
    </ul>
</template>

<script setup>

    const props = defineProps({
        debt_balance: Number,
        discount_balance: Number,
        total_balance: Number,
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