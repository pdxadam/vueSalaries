<script setup>
    import Cell from '../classes/Cell'
    const props = defineProps({
        thisCell: Object, //Cell
        editMode: String,
    })
    

</script>
<template>
    <td v-if = "editMode == 1">
        <input type="text" tabindex="1" pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" value="" data-type="currency" v-model = thisCell.salary >
    </td>
    <td v-else-if = "editMode == 2">
        <input type="text" tabindex="1" value=""  v-model = thisCell.fte >
    </td>
    <td v-else tabindex = "0">        
        <span class='salary'>${{ thisCell.salary }}</span>
        <span class='fte'>{{  thisCell.fte }} fte</span>
    </td>

</template>
<style scoped>
    
    .salary{
        font-size: 0.8em;
    }
    
    .fte{
        position: absolute;
        font-size: 0.5em;
        right: 0px;
        bottom: 0px;
        color: gray;
    }
    input{
        width: 80px;

    }
</style>
