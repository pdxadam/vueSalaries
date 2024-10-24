<script setup>
    import Cell from '../classes/Cell'
    const props = defineProps({
        cell: Cell,

    })

</script>
<template>
    <td>
        <span class='salary'>${{ cell.salary }}</span>
        <span class='fte'>{{  cell.fte }} fte</span>
    </td>
</template>
<style scoped>
    td{
        position: relative;
    }
    .salary{
        font-weight: bold;
        display: block;

    }

    .fte{
        position: absolute;
        font-size: 0.8em;
        right: 0px;
        bottom: 0px;
        color: lightgray;
    }
</style>
