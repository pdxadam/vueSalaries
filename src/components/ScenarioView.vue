<script setup>
    import { Tabs } from 'buefy';
    import HelloWorld from './HelloWorld.vue'
    import Scenario from '../classes/Scenario.js';
    import Salaries from './Salaries.vue';
    import modal_newScenario from './modal_newScenario.vue';
    import { ref } from 'vue';
    import ScenarioSummary from '@/components/ScenarioSummary.vue'
    
    const emit = defineEmits(['createScenario']);
    const props = defineProps({
        scenario: Object, //Scenario
    }
    );
    const isModalActive = ref(false);
    const editMode = ref(false);
    function deleteSchedule(i){
        if(confirm("Delete this salary schedule (" + props.scenario.schedules[i].title + ")?")){
            props.scenario.schedules.splice(i,1);

        }
    }
    function closeModal(){
        isModalActive.value = false;
    }
    function copySchedule(newSched){
        props.scenario.schedules.push(newSched);
        alert("copied!");
    }
    function createScenario(newSchedule, newTitle){
        emit('createScenario', newSchedule, newTitle);
    }
    var USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

</script>
<template>
    <b-button size="is-small" @click = "editMode = !editMode">{{ editMode?"&#x1F4BE":"&#x270E" }}</b-button>
        
    <section>
        
        <ScenarioSummary :scenario = scenario :editMode = editMode />
    <hr>
    <b-tabs type="is-boxed" >
        <b-tab-item v-for = "(schedule, index) in scenario.schedules" :label = schedule.title>
            <b-button type="is-primary" @click="isModalActive = true">Copy Schedule</b-button>
            <b-modal
                v-model="isModalActive"
                has-modal-card
                trap-focus
                :destroy-on-hide="false"
                aria-role="dialog"
                aria-label="New Scenario Modal"
                close-button-aria-label="Close"
                aria-modal>
                    <modal_newScenario @close="closeModal()"  @copySchedule="copySchedule" @createScenario="createScenario" :schedule = schedule />
            </b-modal>
            <b-button @click="deleteSchedule(index);">Delete Schedule</b-button>
            <Salaries :schedule = schedule />
        </b-tab-item>
    </b-tabs>
</section>
</template>
<style scoped>
    section{
        border: 1px solid black;
    }
    h1{
        font-size: 2em;
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
    }

</style>