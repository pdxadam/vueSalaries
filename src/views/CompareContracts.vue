<script setup>
    import { ref } from 'vue'
    import ScenarioSummary from '@/components/ScenarioSummary.vue'

    const props = defineProps({
        scenarios: Array,
        selectedScenario: Object, //one to add if we click 'add'
    });
    const comparisonList = ref([]);
    var USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
});
    function addSelected(){
        comparisonList.value.push(props.selectedScenario);
    }
    function removeSelected(index){
        comparisonList.value.splice(index, 1);
    }
</script>
<template>
    <b-button v-if = "selectedScenario != null && !comparisonList.includes(selectedScenario)" label="Add To Comparison" @click = "addSelected();"/>
    
    <div class="container">
        <div v-for="(s, index) in comparisonList">
            <b-button @click = "removeSelected(index);" label="Remove"></b-button>
            <h1>Scenario {{ index + 1 }}</h1>
            <ScenarioSummary  :scenario="s" />
        </div>
        <div v-if="comparisonList.length !== 2">
            Pick 2 to show differences
        </div>
        <div v-else class="delta">
            <table>
                <thead>
                <tr>
                    <th colspan = 2>Scenario 1 minus Scenario 2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>&#x0394; Insurance cost </td>
                    <td>{{  USDollar.format(comparisonList[0].getInsuranceCosts() - comparisonList[1].getInsuranceCosts()) }}</td> 
                </tr>
                <tr>
                    <td>&#x0394; Salary cost</td>
                    <td>{{  USDollar.format(comparisonList[0].getSalaryCosts() - comparisonList[1].getSalaryCosts()) }}</td> 
                </tr>
                <tr>
                    <td>&#x0394; Additional Costs</td>
                    <td>{{  USDollar.format(comparisonList[0].getAdditionalCosts() - comparisonList[1].getAdditionalCosts()) }}</td> 
                
                </tr>
                <tr>
                    <td>&#x0394; Insurance + Salary cost </td>
                    <td>{{  USDollar.format(comparisonList[0].getTotalCost() - comparisonList[1].getTotalCost()) }}</td> 
                </tr>
                <tr>
                    <td>&#x0394; Fully Allocated cost</td>
                    <td>{{  USDollar.format(comparisonList[0].getFullyAllocatedCost() - comparisonList[1].getFullyAllocatedCost()) }}</td> 
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>
<style scoped>
    .container{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        background-color: rgb(211, 231, 245);

    }
    .container div{
        border: 1px dashed blue;
        padding: 3px;
        margin: 2px 5px;
    }

    td{
        padding: 1px 3px;
        border: 1px solid black;
    }
    td:nth-child(2){
        text-align: right;
        font-weight: normal;
    }
    .delta{
        box-shadow: 2px 2px grey;
    }
    th{
        font-weight: bold;
        text-align: center !important;
    }
</style>