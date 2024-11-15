<template>
    <ul class="debts-list">
        <li v-for="({name, pivot}) in debts" :key="pivot.id" class="debts-list-item" 
            :class="[
                (pivot.unit_price > 0) ? 'debt_balance' : 'discount_balance',
                (pivot.filed_at) ? 'is_filed':''
            ]" >
            <span class="price-detail-tag" :class="(Boolean(pivot.was_paid)) ? 'was-paid': ''">${{addThousandthPoint((pivot.unit_price * pivot.quantity))}} {{name}}</span>
            <KebabMenuDebtAction :data-debt="pivot.id">
                <template v-slot:editButton>
                    <button type="button" class="edit-tag" @click="$emit('handleEditDebt', pivot.id)">
                        <span>Editar</span>
                        <i class='bx bx-edit bx-sm'></i>
                    </button>
                </template>
                <template v-slot:payOrCrossButton>
                    <button type="button" class="delete-tag" @click="$emit('handleDeleteDebt', pivot.id)">
                        <span>{{ (!pivot.was_paid) ? 'Tachar' : 'Anotar'}}</span>
                        <i class='bx bx-sm' :class="(!pivot.was_paid) ? 'bx-dollar' : 'bx-undo'"></i>
                    </button>
                </template>
                <template v-slot:fileButton>
                    <button type="button" class="file-tag" @click="$emit('handleFileDebt', pivot.id)">
                        <span>{{ (!pivot.filed_at) ? 'Archivar' : 'Desarchivar'}}</span>
                        <i v-if="!pivot.filed_at" class='bx bx-folder-plus bx-sm'></i>
                        <i v-else class='bx bx-folder-minus bx-sm'></i>
                    </button>
                </template>
            </KebabMenuDebtAction>
        </li>
    </ul>
</template>

<script setup>
    import { addThousandthPoint } from '../helpers/Balances';
    import KebabMenuDebtAction from './KebabMenuDebtAction.vue'

    const props = defineProps({
        debts: Array,
    })
</script>

<style scoped>
.debts-list{
  min-height: 20vh;
  max-height: 40vh;
  background-color: var(--grey);
  border-radius: 25px;
  padding: 1.5rem 1rem;
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
}
.price-detail-tag{}
.edit-tag,
.delete-tag,
.file-tag{
    color: var(--color-titles);
}

.edit-tag,
.delete-tag,
.file-tag{
    font: normal normal normal 1.2rem var(--default-font);
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

    .edit-tag,
    .delete-tag,
    .file-tag{
        font: normal normal normal 1.7rem var(--default-font);
    }
}

@media (width >= 1280px) {
    .edit-tag,
    .delete-tag,
    .file-tag{
        font: normal normal normal 1.5rem var(--default-font);
    }
}
@media (width >= 1300px) {
    .debts-list-item{
        font: normal normal normal 1.7rem var(--default-font);
        gap: .5rem;
    }
}
</style>