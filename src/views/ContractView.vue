<script setup>
    import Scenario from '../classes/Scenario.js';
    import Schedule from '../classes/Schedule.js';
    import { Tabs } from 'buefy'
    import { ref, watch } from 'vue'
    import ScenarioList from '@/components/ScenarioList.vue';
    import ScenarioView from '@/components/ScenarioView.vue';
    import CompareContracts from '@/views/CompareContracts.vue';
//TODO: add an insurnace pool calculator (Riverdale Only, I guess)
    
    const scenarios = ref([]);
    const selectedScenario = ref();
    const selectedIndex = ref();
    const file = ref({});
    load();
    watch(scenarios.value, save, { deep: true });
    function save(){
        localStorage.setItem("myScenarios", JSON.stringify(scenarios.value));
    }
    function selectScenario(s){
        selectedScenario.value = s
    }

    
    
    
    function load(){
        var myScenarios = [];
        var jsonScenarios = localStorage.getItem("myScenarios");
        
        if (jsonScenarios != null){
            let objScenarios = JSON.parse(jsonScenarios);
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
    
    <ScenarioList :scenarios = scenarios @setSelectedScenario="selectScenario" />
    <b-tabs>
        <b-tab-item label="Detail">
            <section>
                <ScenarioView v-if = "selectedScenario != null" :scenario = selectedScenario @createScenario = "createScenario"></ScenarioView>
                <div v-else>Select an item from the list</div>
            </section>  
        </b-tab-item>
        <b-tab-item label="Compare">
            <section>
                <CompareContracts :scenarios = scenarios :selectedScenario = selectedScenario />
            </section>
        </b-tab-item>
    </b-tabs>
    
   
</template>
<style scoped>
   
</style>