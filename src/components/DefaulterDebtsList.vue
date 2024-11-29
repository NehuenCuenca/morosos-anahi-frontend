<template>
    <ul class="debts-list">
        <li v-for="(month_year, rdmindex) in Object.keys(debts)" :key="rdmindex" class="debts-list-item" >
            <DownloadExcelDebtsLink :monthYear="month_year" :defaulter_id="debts[month_year][0].pivot.defaulter_id"/>
            
            <ul class="debst-list-by-month-year">
                <li v-for="(debt) in debts[month_year]" :key="debt.pivot.id" class="debt-item-by-month-year" 
                    :class="[
                        (debt.pivot.unit_price > 0) ? 'debt_balance' : 'discount_balance',
                        (debt.pivot.filed_at) ? 'is_filed':''
                    ]" >
                    <span class="price-detail-tag" :class="(Boolean(debt.pivot.was_paid)) ? 'was-paid': ''">${{addThousandthPoint((debt.pivot.unit_price * debt.pivot.quantity))}} {{debt.name}}</span>
                    <KebabMenuDebtAction :data-debt="debt.pivot.id">
                        <template v-slot:editButton>
                            <button type="button" class="edit-tag" @click="$emit('handleEditDebt', debt)">
                                <span>Editar</span>
                                <i class='bx bx-edit bx-sm'></i>
                            </button>
                        </template>
                        <template v-slot:payOrCrossButton>
                            <button type="button" class="delete-tag" @click="$emit('handleSoftDeleteDebt', debt)">
                                <span>{{ (!debt.pivot.was_paid) ? 'Tachar' : 'Anotar'}}</span>
                                <i class='bx bx-sm' :class="(!debt.pivot.was_paid) ? 'bx-dollar' : 'bx-undo'"></i>
                            </button>
                        </template>
                        <template v-slot:fileButton>
                            <button type="button" class="file-tag" @click="$emit('handleFileDebt', debt)">
                                <span>{{ (!debt.pivot.filed_at) ? 'Archivar' : 'Desarchivar'}}</span>
                                <i v-if="!debt.pivot.filed_at" class='bx bx-folder-plus bx-sm'></i>
                                <i v-else class='bx bx-folder-minus bx-sm'></i>
                            </button>
                        </template>
                        <template v-slot:deleteButton>
                            <button type="button" class="delete-tag" @click="$emit('handleHardDeleteDebt', debt)">
                                <span>Eliminar</span>
                                <i class='bx bx-trash'></i>
                            </button>
                        </template>
                    </KebabMenuDebtAction>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script setup>
    import { addThousandthPoint } from '../helpers/Balances';
    import DownloadExcelDebtsLink from './DownloadExcelDebtsLink.vue';
    import KebabMenuDebtAction from './KebabMenuDebtAction.vue';

    const props = defineProps({
        debts: Object,
    })
</script>

<style scoped>
.debts-list{
  min-height: 20vh;
  max-height: 60vh;
  background-color: var(--grey);
  border-radius: 25px;
  padding: 1.5rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  gap: .5rem;
  overflow-y: auto;
}

.debts-list-item{
  font: normal normal normal 1.3rem var(--default-font);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
}

.debst-list-by-month-year{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0 1rem;
}

.debt-item-by-month-year{
    width: max-content;
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
        flex-wrap: wrap;
        gap: 1.5rem;
        overflow-y: auto;
    }

    .debts-list-item{
        font: normal normal normal 2rem var(--default-font);
        gap: .5rem;
    }

    .month-year-separator{
        font: normal normal normal 1.8rem var(--display-font);
    }

    .edit-tag,
    .delete-tag,
    .file-tag{
        font: normal normal normal 1.7rem var(--default-font);
    }
}

@media (width >= 1280px) {
    .debts-list{
        width: clamp(400px, 40%, 500px);
    }

    .month-year-separator{
        font: normal normal normal 1.6rem var(--display-font);
    }

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