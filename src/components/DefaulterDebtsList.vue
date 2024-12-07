<template>
    <form class="debts-form" @submit.prevent="handleSubmit">
        <nav class="debt-actions-nav" v-if="checkedDebts.length >= 1">
            <span class="debt-actions-nav__selecteds-quantity">{{ checkedDebts.length }} {{messageSelectedDebtsQuantity}}</span>
            <ul class="debt-actions-list" v-if="checkedDebts.length === 1">
                <li class="debt-actions-list-item">
                    <button type="button" class="debt-action-button"  @click="$emit('handle-soft-delete-debt', checkedDebts[0])">
                        <i class='bx bx-sm' :class="(!selectedWasPaid) ? 'bx-dollar' : 'bx-undo'"></i>
                        <span>{{ (!selectedWasPaid) ? 'Tachar' : 'Anotar'}}</span>
                    </button>
                </li>
                <li class="debt-actions-list-item">
                    <button type="button" class="debt-action-button" @click="$emit('handle-file-debt', checkedDebts[0])">
                        <i class='bx bx-sm' :class="(!selectedFiledAt) ? 'bx-folder-plus' : 'bx-folder-minus'"></i>
                        <span>{{ (!selectedFiledAt) ? 'Archivar' : 'Desarchivar'}}</span>
                    </button>
                </li>
                <li class="debt-actions-list-item">
                    <button type="button" class="debt-action-button" @click="$emit('handle-edit-debt', checkedDebts[0])">
                        <i class='bx bx-edit bx-sm'></i>
                        <span>Editar</span>
                    </button>
                </li>
                <li class="debt-actions-list-item">
                    <button type="button" class="debt-action-button" @click="$emit('handle-hard-delete-debt', checkedDebts[0])">
                        <i class='bx bx-trash bx-sm'></i>
                        <span>Eliminar</span>
                    </button>
                </li>
            </ul>

            <ul class="debt-actions-list" v-else>
                <li class="debt-actions-list-item" v-if="availableCrossOutDebts">
                    <button type="button" class="debt-action-button" @click="handleDebtsCollectionActionLocal({was_paid: true})">
                        <i class='bx bx-sm bx-dollar'></i>
                        <span>Tachar</span>
                    </button>
                </li>
                
                <li class="debt-actions-list-item" v-if="availableAnnotateDebts">
                    <button type="button" class="debt-action-button" @click="handleDebtsCollectionActionLocal({was_paid: false})">
                        <i class='bx bx-sm bx-undo'></i>
                        <span>Anotar</span>
                    </button>
                </li>
                <li class="debt-actions-list-item" v-if="availableArchiveDebts">
                    <button type="button" class="debt-action-button" @click="handleDebtsCollectionActionLocal({filed_at: getTodayDateFormated()})">
                        <i class='bx bx-sm bx-folder-plus'></i>
                        <span>Archivar</span>
                    </button>
                </li>
                <li class="debt-actions-list-item" v-if="availableUnarchiveDebts">
                    <button type="button" class="debt-action-button" @click="handleDebtsCollectionActionLocal({filed_at: null})">
                        <i class='bx bx-sm bx-folder-minus'></i>
                        <span>Desarchivar</span>
                    </button>
                </li>
                <li class="debt-actions-list-item" v-if="gotSameUnitPrice">
                    <button type="button" class="debt-action-button" @click="handleCaptureUnitPrice">
                        <i class='bx bx-sm bx-trending-up'></i>
                        <span>Subir</span>
                    </button>
                </li>
                <li class="debt-actions-list-item">
                    <button type="button" class="debt-action-button" @click="handleHardDeleteDebtsCollection">
                        <i class='bx bx-sm bx-trash'></i>
                        <span>Eliminar</span>
                    </button>
                </li>
            </ul>

            <button type="button" class="debt-actions-nav__close-button" @click="checkedDebts = []">
                <i class='bx bx-x bx-md'></i>
                <span>Cerrar</span>
            </button>
        </nav>
        <ul class="debts-list">
            <li v-for="(month_year, rdmindex) in Object.keys(debts)" :key="rdmindex" class="debts-list-item" >
                <DownloadExcelDebtsLink :monthYear="month_year" :defaulter_id="debts[month_year][0].pivot.defaulter_id"/>
                
                <ul class="debst-list-by-month-year">
                    <li v-for="(debt) in debts[month_year]" :key="debt.pivot.id" class="debt-item-by-month-year" 
                        :class="[
                            (debt.pivot.unit_price > 0) ? 'debt_balance' : 'discount_balance',
                            (debt.pivot.filed_at) ? 'is_filed':''
                        ]">
                        <span class="price-detail-tag" :class="(debt.pivot.was_paid) ? 'was-paid': ''" :title="debt.pivot.retired_at">${{addThousandthPoint((debt.pivot.unit_price * debt.pivot.quantity))}} {{debt.name}}</span>
                        <input class="debt-checkbox-select" type="checkbox" :name="`${debt.pivot.id}-check-debt-selected`" :value="debt" v-model="checkedDebts">
                    </li>
                </ul>
            </li>
        </ul>
    </form>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import { addThousandthPoint } from '../helpers/Balances';
    import DownloadExcelDebtsLink from './DownloadExcelDebtsLink.vue';
    import { getTodayDateFormated } from '../helpers/Dates';

    const props = defineProps({
        debts: Object,
    })

    const emits = defineEmits(['handle-soft-delete-debt', 'handle-file-debt', 'handle-edit-debt', 'handle-hard-delete-debt', 'handle-debts-collection-update', 'handle-debts-collection-delete'])

    const checkedDebts = ref([])

    const handleSubmit = (event) => { 
        console.log(checkedDebts.value);
    }

    const messageSelectedDebtsQuantity = computed(() => (checkedDebts.value.length===1) ? 'deuda seleccionada' : 'deudas seleccionadas')
    const selectedWasPaid = computed(() => checkedDebts.value[0].pivot.was_paid)
    const selectedFiledAt = computed(() => checkedDebts.value[0].pivot.filed_at)
    const availableCrossOutDebts = computed(() => checkedDebts.value.every( ({pivot}) => !pivot.was_paid ))
    const availableAnnotateDebts = computed(() => checkedDebts.value.every( ({pivot}) => pivot.was_paid ))
    const availableArchiveDebts  = computed(() => checkedDebts.value.every( ({pivot}) => !pivot.filed_at ))
    const availableUnarchiveDebts = computed(() => checkedDebts.value.every( ({pivot}) => pivot.filed_at ))
    const gotSameUnitPrice = computed(() => checkedDebts.value.every( ({pivot}) => checkedDebts.value[0].pivot.unit_price === pivot.unit_price ))

    const handleDebtsCollectionActionLocal = (changes) => { 
        const defaulter_id = checkedDebts.value[0].pivot.defaulter_id
        const debts_id = checkedDebts.value.map( ({pivot}) => pivot.id)

        const payload = { debts_id, ...changes }
        
        emits('handle-debts-collection-update', { defaulter_id, payload })
        checkedDebts.value = []
    }

    const handleCaptureUnitPrice = () => { 
        const new_unit_price = parseInt( 
            prompt('Ingrese el nuevo precio unitario: ', checkedDebts.value[0].pivot.unit_price)
        )   
        
        if( Number.isNaN(new_unit_price) ) return handleCaptureUnitPrice()

        handleDebtsCollectionActionLocal({unit_price: new_unit_price})
        return
    }

    const handleHardDeleteDebtsCollection = () => {
        const confirmHardDeleteDebtsCollection = confirm(`¿Esta seguro de ELIMINAR las deudas seleccionadas?`)
        if(!confirmHardDeleteDebtsCollection) return

        const defaulter_id = checkedDebts.value[0].pivot.defaulter_id
        const debts_id = checkedDebts.value.map( ({pivot}) => pivot.id)

        const payload = { debts_id }
        
        emits('handle-debts-collection-delete', { defaulter_id, payload })
        checkedDebts.value = []
    }
</script>

<style scoped>
.debts-form{
    position: relative;
}

.debt-actions-nav{
    position: absolute;
    background-color: rgba(107, 79, 79, 0.9);
    min-height: 10vh;
    max-height: 30vh;
    width: 95%;
    border-radius: 15px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    justify-content: flex-start;
    align-items: center;
    color: var(--marshmallow);
    resize: vertical;
    overflow: auto;
}

.debt-actions-nav__selecteds-quantity{
    font: normal normal normal 1.4rem var(--display-font);
    color: var(--beige);
}

.debt-actions-nav__close-button{
    font: normal normal normal 1.2rem var(--display-font);
    color: var(--marshmallow);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 2px solid var(--black);
}

.debt-actions-list{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 2rem;
}

.debt-actions-list-item{}

.debt-action-button{
    color: var(--beige);
    font: normal normal normal 1.1rem var(--display-font);
    display: flex;
    align-items: center;
    gap: .2rem;
}

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
/* .debts-list{
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
} */

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
    gap: .5rem;
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

.debt-checkbox-select{
    width: 1.5rem;
    height: 1.5rem;
    accent-color: var(--color-font);
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
    .debts-form{
        width: clamp(400px, 40%, 500px);
    }
    /* .debts-list{
        width: clamp(400px, 40%, 500px);
    } */

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