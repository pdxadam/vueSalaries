<script setup>
    import { ref } from 'vue'
    import * as ExcelJS from 'exceljs'
    import { saveAs } from 'file-saver'
    import Scenario from '@/classes/Scenario.js'
    import Schedule from '@/classes/Schedule.js'
    
    const props = defineProps({
        scenarios: Array,
        
    });
    const selectedScenario = ref();
    const selectedIndex = ref();
    const file = ref({});
    const emit = defineEmits(['setSelectedScenario']);
    function createScenario(newSchedule, newTitle){
        let n = new Scenario(newTitle);
        n.schedules.push(newSchedule);
        props.scenarios.push(n);
    }
    function duplicate(){
        props.scenarios.push(Scenario.Duplicate(selectedScenario.value));
        
    }
    function setSelectedScenario(scenario, index){

        selectedScenario.value = scenario;
        selectedIndex.value = index;
        emit('setSelectedScenario', scenario);
    }
    function handleUpload(event){
        var reader = new FileReader();
        reader.readAsText(file.value, "UTF-8");
        reader.onload = function(event){
            try{
                const newScenario = Scenario.CreateFromJson(event.target.result);
                if(confirm("Import " + newScenario.title) + "?"){
                    props.scenarios.push(newScenario);
                }
            }
            catch{
                alert("Invalid data");
            }

        }
        file.value = {};
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
    function downloadBackup(currentScenarioOnly = false){
        var jsonScenarios, filename;
        if (currentScenarioOnly){
            jsonScenarios = JSON.stringify(selectedScenario.value);
            filename = selectedScenario.value.title + ".json";
        }
        else{
             jsonScenarios = JSON.stringify(scenarios.value);        
             filename = "contractScenarios.json";
        }
        downloadFile(jsonScenarios, filename);
    }
    function downloadExcel(){
        console.log("gotcha!");
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "McLainonline.com";
        workbook.lastModifiedBy = "mclainonline.com";
        workbook.created = new Date();
        workbook.modified = new Date();

        workbook.properties.date1904 = true;
        workbook.calcProperties.fullCalcOnLoad = true;
        workbook.views = [
            { x:0, y: 0, width: 10000, height: 20000, firstSheet: 0, activeTab: 1, visibility: 'visible'

        }]
        const summarySheet = workbook.addWorksheet("Summary");
        summarySheet.addRow(["Title:", selectedScenario.value.title]);
        summarySheet.addRow(["Description:", selectedScenario.value.description]);
        summarySheet.addRow();

        summarySheet.addRow(["Summary Information"]);
        summarySheet.addRow(["Insurance Cost", selectedScenario.value.getInsuranceCosts()]);
        summarySheet.addRow(["Additional Costs", selectedScenario.value.getAdditionalCosts()]);
        summarySheet.addRow(["Salary Cost", selectedScenario.value.getSalaryCosts()]);
        summarySheet.addRow(["Insurance + Add'l + Salary Cost", selectedScenario.value.getTotalCost()]);
        summarySheet.addRow(["Associated Payroll Cost (Percent)", selectedScenario.value.percentAssociatedCosts]);
        summarySheet.addRow(["Fully Allocated Cost", selectedScenario.value.getFullyAllocatedCost()]);
        
        for (let schedule of selectedScenario.value.schedules){
            const s = workbook.addWorksheet(schedule.title);
            //title/summary info
            s.addRow(["schedule title: ", schedule.title]);
            s.addRow(["Description:", schedule.description]);
            s.addRow(["Insurance Contribution", schedule.insurance]);
            s.addRow();
            s.addRow(["Additional Costs:"])
            s.addRow(["title", "Amount", "Times/Year", "Per FTE?"]);
            for (let cost of schedule.additionalCosts){
                s.addRow([cost.title, cost.amount, cost.timesPerYear, cost.perMember])
            }
            //handling the salaries
            s.addRow();
            s.addRow(["Salaries"].concat(schedule.colTitles));
            for (var i = 0; i < schedule.cells.length; i++){
                let newRow = [schedule.rowTitles[i]];
                for (let cell of schedule.cells[i]){
                    newRow.push(parseFloat(cell.salary));
                }
                s.addRow(newRow);
            }
            s.addRow();
            s.addRow();
            s.addRow(["FTE"].concat(schedule.colTitles));
            for (var i = 0; i < schedule.cells.length; i++){
                
                let newRow = [schedule.rowTitles[i]];
                for (let cell of schedule.cells[i]){
                    newRow.push(parseFloat(cell.fte));
                }
                s.addRow(newRow);
            }

        }
        var fileName = selectedScenario.value.title + ".xlsx";
        console.log(fileName);
        
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            saveAs(blob, fileName);
            console.log("done");
        });
    
        
    }
    function deleteScenario(){
        if (confirm("Are you sure you want to delete this scenario? " + selectedScenario.value.title + "\nThis can't be undone, but you can download a backup first, if you want")){
            props.scenarios.splice(selectedIndex.value, 1);
            selectedScenario.value = null;
            selectedIndex.value = null;
        }
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
                <b-menu-list label="Contracts">
                    <b-menu-item v-for="(s, index) in scenarios" :label=s.title @click="setSelectedScenario(s, index);" />
                </b-menu-list>
            </b-menu>
            <!-- <b-button @click="downloadBackup()">Download Backup</b-button> Hiding 'cause I don't the the whole set is needed -->
            <div class="mcActions" v-if = "selectedScenario != null">
                <h3>Selected Scenario Actions</h3> 
                <b-button expanded icon-left="content-copy" @click="duplicate()">Duplicate</b-button>
                <b-button expanded icon-left = "export" @click="downloadExcel()">Export Excel</b-button>
                <b-button expanded icon-left = "download" type="is-success is-light"  @click="downloadBackup(true);">Download Scenario Backup</b-button>
                <b-button icon-left = "delete-forever" type="is-danger is-light" expanded @click="deleteScenario();">Delete Selected Scenario</b-button>

               
            </div>
            <div class="mcActions">
            <h3>General Actions</h3>    
                <b-button expanded @click="createScenario(Schedule.SeedSchedule('Starter', 17, 7), 'New Scenario')">Create Scenario</b-button>
                <b-field class="file">
                    <b-upload v-model=file expanded>
                        <a class="button is-fullwidth">
                            <b-icon icon="upload"></b-icon>
                            <span>{{ file.name || "Upload Scenario Backup"}}</span>
                        </a>
                    </b-upload>
                    
            </b-field>
            <b-button type="is-primary" expanded v-if = "file.name" @click="handleUpload()">Process File</b-button>
            
            </div>
        </b-sidebar>
    </section>
</template>
<style scoped>
     .mcActions{
        margin-top: 30px;
        border-top: 1px solid lightgrey;
        padding: 5px 0px;
    }
</style>