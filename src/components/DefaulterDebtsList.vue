<template>
    <ul class="debts-list">
        <li v-for="({name, pivot}) in debts" :key="pivot.id" class="debts-list-item" 
            :class="[
                (pivot.unit_price > 0) ? 'debt_balance' : 'discount_balance',
                (pivot.filed_at) ? 'is_filed':''
            ]" >
            <span class="price-detail-tag" :class="(Boolean(pivot.was_paid)) ? 'was-paid': ''">${{addThousandthPoint((pivot.unit_price * pivot.quantity))}} {{name}}</span>
            <button class="edit-tag" @click="$emit('handleEditDebt', pivot.id)">
                <i class='bx bx-edit bx-sm'></i>
            </button>
            <button class="delete-tag" @click="$emit('handleDeleteDebt', pivot.id)">
                <i class='bx bx-sm' :class="(!pivot.was_paid) ? 'bx-dollar' : 'bx-undo'"></i>
            </button>
            <button class="file-tag" @click="$emit('handleFileDebt', pivot.id)">
                <i v-if="!pivot.filed_at" class='bx bx-folder-plus bx-sm'></i>
                <i v-else class='bx bx-folder-minus bx-sm'></i>
            </button>
        </li>
    </ul>
</template>

<script setup>
    import { addThousandthPoint } from '../helpers/Balances';

    const props = defineProps({
        debts: Array,
    })
</script>

<style scoped>
.debts-list{
  min-height: 15vh;
  max-height: 40vh;
  background-color: var(--grey);
  border-radius: 25px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: .5rem;
  overflow-y: auto;
}

.debts-list-item{
  font: normal normal normal 1.3rem var(--default-font);
  display: flex;
  align-items: center;
  gap: .2rem;
}
.price-detail-tag{}
.edit-tag,
.delete-tag,
.file-tag{
    color: var(--color-titles);
}

.was-paid{
    text-decoration: line-through;
}
.is_filed{
    color: color-mix(in srgb, 80% var(--chocolate-dark), 20% var(--marshmallow));
}

@media (width >= 768px) {
    .debts-list{
        width: 95%;
        margin: 0 auto;
        flex-wrap: wrap;
        gap: 1rem;
        overflow-y: auto;
    }

    .debts-list-item{
        font: normal normal normal 2rem var(--default-font);
        gap: .5rem;
    }
}

/* @media (width >= 1280px) {} */
@media (width >= 1300px) {
    .debts-list-item{
        font: normal normal normal 1.7rem var(--default-font);
        gap: .5rem;
    }
}
</style>