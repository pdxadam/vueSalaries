<script setup>
    const props = defineProps({
        scenario: Object,
        editMode: Boolean,
    });
    var USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
});

</script>
<template>
    <h1 v-if = "editMode == false">Scenario: {{ scenario.title }}</h1>
    <h1 v-else>
        <b-field label="Scenario Title" type="is-info">
            <b-input type="text" v-model = scenario.title></b-input>
        </b-field>
    </h1>
    
    <h4 v-if = "editMode == false">{{ scenario.description }}</h4>
    <h4 v-else>
        <b-field label="Scenario Description">
            <b-input v-model = scenario.description></b-input>
        </b-field>
    </h4>
    <table class="summary">
            <tbody>
            <tr>
                <td>Insurance Cost:</td>
                <td> {{ USDollar.format(scenario.getInsuranceCosts()) }}</td>
            </tr>   
            <tr>
                <td>Salary Cost:</td>
                <td> {{ USDollar.format(scenario.getSalaryCosts()) }}</td>
            </tr>
            <tr>
                <td>
                    Additional Costs:
                </td>
                <td>{{ USDollar.format(scenario.getAdditionalCosts()) }}</td>
            </tr>   
            <tr>
                <td>Total Costs:</td>
                <td>{{  USDollar.format(scenario.getTotalCost()) }}</td>
            </tr>    
            <tr>
                <td>Associated Payroll Costs: </td>
                <td v-if="editMode == false">{{ scenario.percentAssociatedCosts }}%</td>
                <td v-else><b-input v-model="scenario.percentAssociatedCosts"></b-input> </td>
            </tr> 
            <tr>
                <td>Fully Allocated Total:</td>
                <td>{{ USDollar.format(scenario.getFullyAllocatedCost()) }}</td>
            </tr>
        </tbody>
        </table>
</template>
<style scoped>
h1{
        font-weight: bold;
        font-family: Verdana, Geneva, Tahoma, sans-serif;

    }
    h4{
        font-style: italic;
        font-family: 'Times New Roman', Times, serif;
        margin-left: 10px;
    }
    h5{
        font-family: 'Times New Roman', Times, serif;
        background-color: lightgray;
        margin: 3px;
    }
    table{
        border: 3px inset lightgray;
        margin: 5px auto;
        
    }
    tr{
      border: 1px solid rgb(194, 237, 240);;  
    }
    td{
        padding: 2px;
        text-align: right;
    }
    td:nth-child(2){
        font-weight: bold;
        text-align: right;
        padding-left: 5px;
    
    }
    tr:nth-child(odd){
        background-color: rgb(250, 250, 250);
    }
</style>