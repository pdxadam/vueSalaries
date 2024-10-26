<script setup>
    import Scenario from '../classes/Scenario.js';
    import Schedule from '../classes/Schedule.js';
    import { Tabs } from 'buefy'
    import { ref, watch } from 'vue'
    import ScenarioView from '@/components/ScenarioView.vue';

        //TODO: save stuff to localstorage
    const scenarios = ref([]);
    load();
    watch(scenarios.value, save, { deep: true });
    function save(){
        localStorage.setItem("myScenarios", JSON.stringify(scenarios.value));
    }
    function load(){
        var myScenarios = [];
        var jsonScenarios = localStorage.getItem("myScenarios");
        
        if (jsonScenarios != null){
            let objScenarios = JSON.parse(jsonScenarios);
            //TODO: Actually restructure the objects
            for (var i = 0; i < objScenarios.length; i++){
                myScenarios.push(Scenario.CreateFromJson(JSON.stringify(objScenarios[i])));
            }
            scenarios.value = myScenarios;
        }
        else{
            let c = new Scenario("Sample Contract", "This is the actual contract set");
            c.schedules.push(Schedule.SeedSchedule("2022-23 Actual", 15, 7));
            c.advanceLast("2023-24 actual", 4);
            c.advanceLast("2024-25", 3);    
            scenarios.value.push(c);
        }
    }
    



    
</script>
<template>
    <h1>Contract View</h1>
    <b-tabs vertical>
        <b-tab-item v-for = "s in scenarios" :label=s.title>
            <ScenarioView :scenario = s></ScenarioView>
        </b-tab-item>
    </b-tabs>
</template>
<style scoped>

</style>