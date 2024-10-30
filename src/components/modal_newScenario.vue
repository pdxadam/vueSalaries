<script setup>
    const emit = defineEmits(['close', 'createScenario', 'copySchedule']);
    import { ref } from 'vue'
    import Schedule from '../classes/Schedule.js'
    const newTitle = ref("");
    const percent = ref(0);
    const createScenario = ref(false);
    const newScenarioTitle = ref("");
    const advanceFTE = ref(true);
    const props = defineProps({
        schedule: Schedule,
    });
    function clearForm(closeForm = true){
        newTitle.value = "";
        percent.value = 0;
        createScenario.value = false;
        newScenarioTitle.value = "";
        advanceFTE.value = true;

    }
    function makeCopy(){
        let newSchedule = props.schedule.copySchedule(newTitle.value,percent.value, advanceFTE.value);

        //if we're just adding it to this scenario, we push it upwards

        if (createScenario.value){
            alert("Create Scenario");
            emit('createScenario', newSchedule, newScenarioTitle.value);
            clearForm();
            emit('close');
        }
        else{
            alert("create schedule");
            emit('copySchedule', newSchedule);
            clearForm();
            emit('close');
        }
    }
</script>
<template>
    
        <section class="modal-card">
            <div class="modal-card-head">
                Copy Schedule: '{{ schedule.title }}'
            </div>
            <div class="modal-card-body">
                <b-field label="Title">
                    <b-input type="text" name="txtBody" v-model = newTitle placeholder="New Schedule Title" />
                </b-field>
                <b-field label="Increase Percent (COLA)">                    
                    <input type="number" v-model = percent name="numPercent" placeholder="0">
                </b-field>
                <b-field label="Advance FTE?">
                    <b-switch v-model="advanceFTE" name="chkFTE">{{ advanceFTE?"Yes":"No" }}</b-switch>
                </b-field>
                <b-field label="Start New Scenario">
                    <b-switch v-model = "createScenario">{{ createScenario?"Yes":"No" }}</b-switch>
                </b-field>
                <b-field v-if="createScenario" label="New Scenario Title">
                    <b-input type="text" v-model = "newScenarioTitle" placeholder="title"></b-input>
                </b-field>
            </div>
            <div class="modal-card-foot">
                
                <b-button type="is-primary" @click="makeCopy()">Make Copy</b-button>
                <b-button @click="$emit('close');">close</b-button>
            </div>
        </section>
    

</template>