<script setup>
    import Schedule from '../classes/Schedule.js';
    import Cellvue from '../components/Cellvue.vue';
    import { Button } from 'buefy'
    import { ref } from 'vue';
    const schedule = ref(Schedule.SeedSchedule("TestSchedule", 15, 7));
    const inEditMode = ref(false);
    const currEditMode = ref("0"); //1 = salaries 2 = FTE
    function addColumn(){
        schedule.value.addColumn();  
    }
    function addRow(){
        schedule.value.addRow();
    }
    function removeColumn(i){
        if (confirm("Are you sure you want to delete this entire column?")){
            schedule.value.removeColumn(i);
        }
    }
    function removeRow(i){
        if (confirm("Delete this row?")){
            schedule.value.removeRow(i);
        }
    }
</script>
<template>
    <header v-if="currEditMode == 0">{{  schedule.title }}</header>
    <header v-else><input v-model = schedule.title></header>
    <label for="chkEdit">Edit</label><input type="checkbox" id = chkEdit inputID="radEditNone" v-model="inEditMode">
    <!-- <label for="radEditNone">No Edit</label><RadioButton v-model = "currEditMode" value="0" />
    <label for="radEditSalary">Edit Salaries</label><RadioButton inputID="radEditSalary" v-model = "currEditMode" value="1" />
    <label for="radEditFTE">Edit FTE</label><RadioButton inputID="radEditFTE" v-model = "currEditMode" value="2" /> -->
    <b-radio v-model = "currEditMode" name="radNoEdit" native-value=0>View Only</b-radio>
    <b-radio v-model = "currEditMode" name="radEditSalary" native-value=1>Edit Salaries</b-radio>
    <b-radio v-model = "currEditMode" name="radEditFTE" native-value=2>Edit FTE</b-radio>
    <div>{{ schedule.getAnnualCost() }}</div>
    <table>
        <thead>
        <tr>
            <th>*</th>
            <th v-if = "currEditMode == 0" v-for="col in schedule.colTitles">{{ col }}</th>
            <th v-else v-for="(col, index) in schedule.colTitles" ><input type=text v-model=schedule.colTitles[index] tabindex=1/><b-button type="is-dark" rounded @click=removeColumn(index)>&#x1F5D1</b-button></th>
            <th v-if = "currEditMode != 0">&nbsp;<b-button type="is-dark" rounded @click="addColumn()">&nbsp;+&nbsp;</b-button>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for = "(row, index) in schedule.cells">
                <th v-if = "currEditMode == 0">{{ schedule.rowTitles[index] }}</th>
                <th v-else><input type="text" v-model=schedule.rowTitles[index] tabindex="2"/><b-button @click=removeRow(index)>&#x1F5D1;</b-button></th>
                <Cellvue v-for="slot in row" :thisCell = "slot" :isFocused = "currEditMode" />
            </tr>
            <tr v-if="currEditMode != 0">
                <th><b-button type="is-dark" rounded @click=addRow()> + </b-button></th>
            </tr>
        </tbody>
    </table>
</template>
<style scoped>
    table{
        border-collapse: collapse;
        overflow:hidden;
    }
    tr:nth-child(1) th{
        
        /* text-orientation:sideways;
        writing-mode:sideways-lr; */
        text-align: center;
        vertical-align:bottom;
        padding-bottom: 0px;
        padding-top: 5px;
    }
    th{
        font-weight: bold;
        border: 1px solid black;
        padding: 2px 10px;
        width: fit-content;
        height: fit-content;
        text-align: center;
    }
    td{
        border: 1px solid grey;
        padding: 2px 5px;
        position: relative;
    }

    td:hover{
        background-color: rgb(158, 106, 12);
        cursor: pointer;
        color: white;
        font-weight: bold;
    }
    td:hover::before{
        content: '';
        height: 2000px;
        top: -1000px;
        width: inherit;
        background-color: yellow;
        position: absolute;
        left: 0px;
        right: 0px;
        z-index: -1;

    }

    tr:hover{
        background-color: yellow;
    }

</style>