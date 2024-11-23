<template>
    <ul class="balances-list">
        <li class="balance-item debt_balance">NEGATIVO: <span class="balance-number">${{debt}}</span></li>
        <li class="balance-item discount_balance">A FAVOR: <span class="balance-number">${{discount}}</span></li>
        <li class="balance-item" :class="(total_balance > 0) ? 'debt_balance' : 'discount_balance'">SALDO: <span class="balance-number">${{total}}</span>
        </li>
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
    border-top: 3px dashed var(--chocolate-dark);
    padding: .5rem;
    width: 95%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.balance-item{
    font: normal normal normal 1.5rem var(--default-font);
}
.total-balance{}

.balance-number{
    font: normal normal normal 1.8rem var(--default-font);
}

@media (width >= 768px) {
    .balances-list{
        flex-direction: row;
        justify-content: space-between;
    }
    .balance-item{
        font: normal normal normal 2rem var(--default-font);
        text-align: center;
    }
    .total-balance{}

    .balance-number{
        font: normal normal normal 2.2rem var(--default-font);
    }
}

@media (width >= 1280px) {
    
}
</style>