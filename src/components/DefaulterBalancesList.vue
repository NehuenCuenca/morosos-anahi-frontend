<template>
    <ul class="balances-list">
        <li class="balance-item" :class="(total_balance > 0) ? 'debt_balance' : 'discount_balance'">SALDO: ${{total}}</li>
        <li class="balance-item debt_balance">NEGATIVO: ${{debt}}</li>
        <li class="balance-item discount_balance">A FAVOR: ${{discount}}</li>
    </ul>
</template>

<script setup>
    import { computed } from 'vue';
    import { addThousandthPoint } from '../helpers/Balances';

    const props = defineProps({
        debt_balance: Number,
        discount_balance: Number,
        total_balance: Number,
    })

    const debt = computed(() => addThousandthPoint(props.debt_balance))
    const discount = computed(() => addThousandthPoint(props.discount_balance))
    const total = computed(() => addThousandthPoint(props.total_balance))
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