<script setup>
    import Cell from '../classes/Cell'
    const props = defineProps({
        thisCell: Cell,
        isFocused: String,
    })
    

</script>
<template>
    <td v-if = "isFocused == 1">
        <input type="text" pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" value="" data-type="currency" v-model = thisCell.salary >
    </td>
    <td v-else-if = "isFocused == 2">
        <input type="text" pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" value="" data-type="currency" v-model = thisCell.fte >
    </td>
    <td v-else tabindex = "0">
        
        <span class='salary'>${{ thisCell.salary }}</span>
        <span class='fte'>{{  thisCell.fte }} fte</span>
    </td>

</template>
<style scoped>
    

    
    .fte{
        position: absolute;
        font-size: 0.5em;
        right: 0px;
        bottom: 0px;
        color: gray;
    }
    input[type=text]{
        width: 40px;
        

    }
</style>
