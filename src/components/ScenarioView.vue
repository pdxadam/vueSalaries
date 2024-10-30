<script setup>
    import { Tabs } from 'buefy';
    import HelloWorld from './HelloWorld.vue'
    import Scenario from '../classes/Scenario.js';
    import Salaries from './Salaries.vue';
    import modal_newScenario from './modal_newScenario.vue';
    import { ref } from 'vue';

    const emit = defineEmits(['createScenario']);
    const props = defineProps({
        scenario: Object, //Scenario
    }
    );
    const isModalActive = ref(false);
    function deleteSchedule(i){
        if(confirm("Delete this salary schedule (" + props.scenario.schedules[i].title + ")?")){
            props.scenario.schedules.splice(i,1);

        }
    }
    function closeModal(){
        isModalActive.value = false;
    }
    function copySchedule(newSched){
        console.log(props.scenario.schedules.length + "copy");
        props.scenario.schedules.push(newSched);
        console.log(props.scenario.schedules.length+ "copy");
        alert("copied!");
    }
    function createScenario(newSchedule, newTitle){
        alert(newTitle);
        emit('createScenario', newSchedule, newTitle);
        //TODO: handel creating the new Scenario
    }
    var USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
    //TODO: Add Insurance and other costs to a scenario
</script>
<template>
    <h1>Scenario: {{ scenario.title }}</h1>
    <h5>{{ scenario.description }}</h5>
    <h5>Total Cost of this scenario: {{ USDollar.format(scenario.getTotalCost()) }}</h5>
    <b-tabs type="is-boxed" expanded>
        <b-tab-item v-for = "(schedule, index) in scenario.schedules" :label = schedule.title>
            <b-button @click="isModalActive = true">Copy Schedule</b-button>
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
            <b-button type="is-primary" @click="deleteSchedule(index);">Delete Schedule</b-button>
            <Salaries :schedule = schedule />
        </b-tab-item>
    </b-tabs>

</template>
<style scoped>

</style>