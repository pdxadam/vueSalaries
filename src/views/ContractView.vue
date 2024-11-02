<script setup>
    import Scenario from '../classes/Scenario.js';
    import Schedule from '../classes/Schedule.js';
    import { Tabs } from 'buefy'
    import { ref, watch } from 'vue'
    import ScenarioView from '@/components/ScenarioView.vue';
//TODO: Add a 'Delete Scenario' option.  
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
    function deleteScenario(){
        if (confirm("Are you sure you want to delete this scenario? " + selectedScenario.value.title + "\nThis can't be undone, but you can download a backup first, if you want")){
            scenarios.value.splice(selectedIndex.value, 1);
            selectedScenario.value = null;
            selectedIndex.value = null;
        }
    }
    function downloadBackup(currentScenarioOnly = false){
        let jsonScenarios = JSON.stringify(scenarios.value);        
        let filename = "contractScenarios.json";
        if (currentScenarioOnly){
            jsonScenarios = JSON.stringify(selectedScenario.value);
            filename = selectedScenario.value.title + ".json";
        }
        downloadFile(jsonScenarios, filename);
    }
    function downloadFile(txt, filename){
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
    function createScenario(newSchedule, newTitle){
        let n = new Scenario(newTitle);
        n.schedules.push(newSchedule);
        scenarios.value.push(n);
    }
    function handleUpload(event){
        var reader = new FileReader();
        reader.readAsText(file.value, "UTF-8");
        reader.onload = function(event){
            try{
                const newScenario = Scenario.CreateFromJson(event.target.result);
                if(confirm("Import " + newScenario.title) + "?"){
                    scenarios.value.push(newScenario);
                }
            }
            catch{
                alert("Invalid data");
            }

        }
        file.value = {};
    }


    
</script>
<template>

    <section class="sidebar-layout">
        <b-sidebar position="static"
        type="is-light"
        :model-value = "true"
        :fullheight = "true"
        :fullwidth = "false"
        :overlay = "false"
        
        >
            <b-menu class="is-custom-mobile">
                <b-menu-list label="Scenarios">
                    <b-menu-item v-for="(s, index) in scenarios" :label=s.title @click="selectedScenario = s; selectedIndex = index;" />
                </b-menu-list>
            </b-menu>
            <!-- <b-button @click="downloadBackup()">Download Backup</b-button> Hiding 'cause I don't the the whole set is needed -->
            <div class="mcActions">
            <b-field class="file">
                <b-upload v-model=file expanded>
                    <a class="button is-primary is-fullwidth">
                        <b-icon icon="upload"></b-icon>
                        <span>{{ file.name || "Upload Scenario Backup"}}</span>
                    </a>
                </b-upload>
            </b-field>
            
                <b-button v-if = "file.name" @click="handleUpload()">Go</b-button>
            </div>
        </b-sidebar>
    </section>
    <section>
            <b-button v-if = "selectedScenario != null" @click="downloadBackup(true);">Download Scenario Backup</b-button>
            <ScenarioView v-if = "selectedScenario != null" :scenario = selectedScenario @createScenario = "createScenario"></ScenarioView>

    </section>   
    <section>
        <b-button v-if = "selectedScenario != null" @click="deleteScenario();">Delete this Scenario {{  selectedScenario.title }}</b-button>
    </section>   
</template>
<style scoped>
    .mcActions{
        margin-top: 30px;
    }
</style>