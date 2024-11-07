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
    static Duplicate(scenarioToCopy){
        let stringedScenario = JSON.stringify(scenarioToCopy);
        let copiedScenario = Scenario.CreateFromJson(stringedScenario);
        copiedScenario.title = copiedScenario.title + "(copy)";
        return copiedScenario;
        //TODO: test the copy function;
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
    getSalaryCosts(){
        var salaryTotal = 0;
        for (let s of this.schedules){
            //salary cost with allocated cost
            salaryTotal += s.getSalaryCost();
        }        
        return salaryTotal;
    }
    getInsuranceCosts(){
        var insuranceCosts = 0;
        for (let s of this.schedules){
            insuranceCosts += s.calcInsuranceCost();
        }
        return insuranceCosts;
    }
    getTotalCost(){
        //adds up the total cost of the shedules in this scenario
       return this.getSalaryCosts() + this.getInsuranceCosts();
    }
    getFullyAllocatedCost(){
        //adds the Associated Payroll Cost to the total
        //OOh, we probably don't count the associated payroll on top of insurance. 
        var salaryTotal = this.getSalaryCosts();
        var insuranceTotal = this.getInsuranceCosts();  
        console.log(salaryTotal);
        console.log(insuranceTotal);      
        //apply the allocated costs
        salaryTotal *= (1 + this.percentAssociatedCosts/100);
        console.log(salaryTotal);
        return salaryTotal + insuranceTotal;
    }

    advanceLast(newTitle, percentage, advanceFTE = true){
        //do I need this at all?
        let newSchedule = this.schedules.at(-1).copySchedule(newTitle, percentage, advanceFTE);
        this.schedules.push(newSchedule);   

    }
}