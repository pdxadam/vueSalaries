<script setup>
    import { ref } from 'vue';
    const props = defineProps({
        addCosts: Array
    });
    
    const newTitle = ref("");
    const newCost = ref();
    const timesPerYear = ref(1);
    const perFTE = ref(false);
    var USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
    function addAdditionalCost(){
        //adds an additional lump costs entry to this schedule. Assumes it is an annual cost (1x per year)
        //e.g. 
        props.addCosts.push({"title":newTitle.value, "amount":newCost.value, "timesPerYear": timesPerYear.value, "perMember": perFTE.value});
        newTitle.value = "";
        newCost.value = null;
        timesPerYear.value = 1;
        perFTE.value = false;
    }
    function deleteCost(index){
        
        let temp = props.addCosts.splice(index, 1)[0];
        console.log(temp);
        newTitle.value = temp.title;
        newCost.value = temp.amount;
        timesPerYear.value = temp.timesPerYear;
        perFTE.value = temp.perMember;

    }
    //TODO: add the new entry row to the table below.
    //TODO: style that table.
    //TODO: wire up the new entry action
    //TODO: apply it to the salary vue. 
</script>
<template>
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Times/Yr.</th>
                <th>Per FTE?</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for = "(cost, index) in addCosts">
                <td>{{ cost.title }}</td>
                <td>{{ USDollar.format(cost.amount) }}</td>
                <td>{{ cost.timesPerYear }}</td>
                <td>{{ cost.perMember }}</td>                
                <td>
                    <b-button size="is-small" type="is-danger is-light" icon-left="delete-forever" @click="deleteCost(index)"></b-button>
                </td>
            </tr>

        </tbody>
        <tfoot>
            <tr>
                <th colspan="4">
                    Create Additional Cost
                </th>
            </tr>
            <tr>
                <td>
                    <b-input size="is-small" type="text" v-model="newTitle" placeholder="title" />
                </td>
                <td>
                    <b-input size="is-small"  type="text" v-model="newCost" placeholder="amount" />
                </td>
                <td>
                    <b-input size="is-small"  type="number" v-model="timesPerYear" placeholder="times per year" />
                </td>
                <td>
                    <b-switch size="is-small"  type="text" v-model="perFTE" />
                 </td>
                 <td>
                     <b-button size="is-small" @click="addAdditionalCost()" label="Save"></b-button>
                </td>
                <!-- Add the new Cost form here -->
            </tr>
        </tfoot>
        
    </table>
</template>
<style scoped>
    table{
        font-size: 0.8em;
        border: 2px outset black;
        margin: 10px;
        margin-left: auto;
        margin-right: auto;

    }
    thead tr:nth-last-child(1){
        border-bottom: 3px solid black;
    }
    th{
        text-align: center;
        font-weight: bold;
        font-size: 1.2rem;

    }
    td:nth-last-child(1){
        text-align: center;
        border-left: 1px solid grey !important;
        padding-left: 2px;
    }
    tbody tr:nth-child(even){
        background-color: rgb(226, 243, 247);
    }
    tfoot tr:nth-child(1){
        border-top: 3px solid black;
    }
</style>