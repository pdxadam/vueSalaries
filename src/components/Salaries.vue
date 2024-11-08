<script setup>
    import Schedule from '../classes/Schedule.js';
    import Cellvue from './Cellvue.vue';
    import { Button } from 'buefy'
    import { ref } from 'vue';
    //TODO: Is it possible to navigate the editing mode with arrow keys?
    const props = defineProps({
        schedule: Schedule,
    });
    const inEditMode = ref(false);
    const adjustPercentAmt = ref(0);
    const currEditMode = ref("0"); //1 = salaries 2 = FTE
    function addColumn(){
        props.schedule.addColumn();  
    }
    function addRow(){
        props.schedule.addRow();
    }
    function removeColumn(i){
        if (confirm("Are you sure you want to delete this entire column?")){
            props.schedule.removeColumn(i);
        }
    }
    function removeRow(i){
        if (confirm("Delete this row?")){
            props.schedule.removeRow(i);
        }
    }
    function adjustPercentage(){
        props.schedule.adjustSalaries(adjustPercentAmt.value)
    }
    var USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
</script>
<template>
    <b-field label="Percent to adjust by">
        <b-input v-model="adjustPercentAmt"></b-input><b-button @click="adjustPercentage()" label="adjust salaries" />
    </b-field>
    <h1 v-if="currEditMode == 0">{{  schedule.title }}</h1>
    <h1 v-else><b-input size="is-large" v-model = schedule.title /></h1>
    <h5 v-if="currEditMode == 0">{{ schedule.description }}</h5>
    <h5 v-else>
        <b-field label="Schedule Description">
            <b-input v-model = schedule.description></b-input>
        </b-field>
    </h5>
    <!-- <label for="radEditNone">No Edit</label><RadioButton v-model = "currEditMode" value="0" />
    <label for="radEditSalary">Edit Salaries</label><RadioButton inputID="radEditSalary" v-model = "currEditMode" value="1" />
    <label for="radEditFTE">Edit FTE</label><RadioButton inputID="radEditFTE" v-model = "currEditMode" value="2" /> -->
    
        <table class="summary">
            <tbody>
            <tr v-if="currEditMode == 0">
                <td>Schedule Duration:</td>
                <td> {{ schedule.durationInMonths }} months</td>
            </tr>
            <tr v-else>
                <td>Duration in Months</td>
                <td><b-input type="number" v-model="schedule.durationInMonths" /></td>
                
            </tr>
            <tr v-if = "currEditMode == 0">
                <td>Insurance Contribution:</td>
                <td>{{ USDollar.format(schedule.insurance) }}</td>
            </tr>
            <tr v-else>
                <td>Insurance Contribution</td>
                <td><b-input type="text" v-model = schedule.insurance /></td>
            </tr>
            <tr>
                <td>FTE Count: </td>
                <td>{{ schedule.countFTE() }}</td>
            </tr>
            <tr>
               <td>Total Insurance Cost:</td> 
               <td>{{ USDollar.format(schedule.calcInsuranceCost()) }}</td> 
            </tr>
            <tr>
                <td>Salary Cost:</td> 
                <td>{{USDollar.format(schedule.getSalaryCost()) }}</td>
            </tr>
            <tr>
                <td>Total Cost: </td>
                <td>{{ USDollar.format(schedule.getAnnualCost()) }}</td>
            </tr>
        </tbody>
        </table>

  
    <!-- TODO: incorporate a button and input to advance the schedule without copying -->
    <b-radio v-model = "currEditMode" :name='"EditMode" + schedule.title' native-value="0" selected>View Only</b-radio>
    <b-radio v-model = "currEditMode" :name='"EditMode" + schedule.title' native-value="1">Edit Salaries</b-radio>
    <b-radio v-model = "currEditMode" :name='"EditMode" + schedule.title' native-value="2">Edit FTE</b-radio>
    
    <table class="schedule">
        <thead>
        <tr>
            <th>*</th>
            <th v-if = "currEditMode == 0" v-for="col in schedule.colTitles">{{ col }}</th>
            <th v-else v-for="(col, index) in schedule.colTitles" ><input type=text v-model=schedule.colTitles[index] tabindex=2/><b-button type="is-dark" rounded @click=removeColumn(index)>&#x1F5D1</b-button></th>
            <th v-if = "currEditMode != 0">&nbsp;<b-button type="is-dark" rounded @click="addColumn()">&nbsp;+&nbsp;</b-button>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for = "(row, index) in schedule.cells">
                <th v-if = "currEditMode == 0">{{ schedule.rowTitles[index] }}</th>
                <th v-else><input type="text" v-model=schedule.rowTitles[index] tabindex="3"/><b-button @click=removeRow(index)>&#x1F5D1;</b-button></th>
                <Cellvue v-for="slot in row" :thisCell = "slot" :editMode = "currEditMode" />
            </tr>
            <tr v-if="currEditMode != 0">
                <th><b-button type="is-dark" rounded @click=addRow()> + </b-button></th>
            </tr>
        </tbody>
    </table>
</template>
<style scoped>
    h1{
        font-size: 1.5em;
        font-family:Verdana, Geneva, Tahoma, sans-serif;
        text-align: center;
    }
    input{
        border: 3px outset rgb(181, 234, 243) !important;
        margin: 1px;
    }
    h5{
        background-color: lightgray;
        padding: 5px;
    }
    table.schedule{
        border-collapse: collapse;
        overflow: hidden;
    }
    table.schedule tr:nth-child(1) th{
        
        /* text-orientation:sideways;
        writing-mode:sideways-lr; */
        vertical-align:bottom;
        padding-bottom: 0px;
    }
    table.schedule th{
        font-weight: bold;
        border: 1px solid black;
        padding: 2px 2px;
        text-align: center !important;
        color: black;
        width: 200px !important;
    }

    table.schedule td{
        border: 1px solid grey;
        padding: 1px 5px;
        position: relative;
    }

    table.schedule td:hover{
        background-color: rgb(82, 77, 15);
        cursor: pointer;
        color: white;
        font-weight: bold;
    }
    table.schedule td:hover::before{
        content: '';
        height: 2000px;
        top: -1000px;
        width: inherit;
        background-color: rgba(255, 255, 0, 0.285);
        position: absolute;
        left: 0px;
        right: 0px;
        z-index: 0;
        pointer-events: none;

    }

    table.schedule tr:hover{
        background-color: rgba(255, 255, 0, 0.285);;
    }
    table.summary{
        border: 3px inset grey;
        padding: 5px; 
        margin: 5px auto;
    }
    table.summary tr:nth-child(even){
        background-color: rgb(227, 242, 246);

    }
    table.summary td{
        padding: 2px 3px;
        text-align: right;

    }
    table.summary td:nth-child(1){
        font-weight: bold;
    }
    input{
        width: 80px;
    }
</style>