import Schedule from './Schedule.js'
export default class Scenario{
    
    title = "blue Scenario";
    description = "Description";
    schedules = [];
    percentAssociatedCosts = 0.0;

    constructor(title, description){
        this.title = title;
        this.description = description;
    }
    
    static CreateFromSchedule(scenarioTitle, description, schedule){
        //copies the schedule and creates a scenario with it a the first schedule in the array.

        let scenario = new Scenario(scenarioTitle, description);
        let newSchedule = Schedule.fromJson(JSON.stringify(schedule));
        scenario.schedules.push(newSchedule);
        return scenario;
    }
    static CreateFromJson(jsonScenario){
        if (jsonScenario == null || jsonScenario == ""){
            return;
        }
        let objScenario = JSON.parse(jsonScenario);
        let newScenario = new Scenario(objScenario.title, objScenario.description);
        newScenario.percentAssociatedCosts = objScenario.percentAssociatedCosts;
        for (var i = 0; i < objScenario.schedules.length; i++){
            let sched = Schedule.fromJsonSchedule(JSON.stringify(objScenario.schedules[i]));
            if (sched != null){
                newScenario.schedules.push(sched);
            }
        }
        return newScenario;
    }
    getTotalCost(){
        //adds up the total cost of the shedules in this scenario
        var total = 0;
        for (var i = 0; i < this.schedules.length; i++){
            let newCost = this.schedules[i].getAnnualCost();
            if (isNaN(newCost)){
                console.log("invalid cost number");
                console.log(newCost);
            }
            else{
                total += newCost;
            }
        }
        return total;
    }
    getFullyAllocatedCost(){
        //adds the Associated Payroll Cost to the total
        let total = this.getTotalCost();
        return total * (1 + this.percentAssociatedCosts/100);
    }

    advanceLast(newTitle, percentage, advanceFTE = true){
        //do I need this at all?
        let newSchedule = this.schedules.at(-1).copySchedule(newTitle, percentage, advanceFTE);
        this.schedules.push(newSchedule);   

    }
}