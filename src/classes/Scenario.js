import Schedule from './Schedule.js'
export default class Scenario{
    
    title = "blue Scenario";
    description = "Description";
    schedules = [];

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
        let objScenario = JSON.parse(jsonScenario);
        let newScenario = new Scenario(objScenario.title, objScenario.description);
        for (var i = 0; i < objScenario.schedules.length; i++){
            let sched = Schedule.fromJsonSchedule(JSON.stringify(objScenario.schedules[i]));
            newScenario.schedules.push(sched);
        }
        return newScenario;
    }
    getTotalCost(){
        //adds up the total cost of the shedules in this scenario
        console.log("getting total cost");
        console.log(this.schedules.length);
        var total = 0;
        for (var i = 0; i < this.schedules.length; i++){
           
            total += this.schedules[i].getAnnualCost();
        }
        return total;
    }

    advanceLast(newTitle, percentage, advanceFTE = true){
        let desc = "Adds " + percentage + "% to '" + this.schedules[this.schedules.length - 1].title;
        if (advanceFTE){
            desc += "' and advances FTE.";
        }
        else{
            desc += "' and does not advance FTE"
        }
        var newSchedule = Schedule.fromJsonSchedule(JSON.stringify(this.schedules[this.schedules.length - 1]));
        newSchedule.description = desc;
        //go through every cell and add the percentage.
        console.log("rows = " + newSchedule.cells.length);
        for (var row = 0; row < newSchedule.cells.length; row++){
            console.log("cols = " + newSchedule.cells[row].length);
            for (var col = 0; col < newSchedule.cells[row].length; col++){
                let newSalary = newSchedule.cells[row][col].salary * (1 + percentage/100);
                newSchedule.cells[row][col].salary = Math.round(newSalary * 100)/100;
            }
        }
        newSchedule.title = newTitle;
        if (advanceFTE){
            //bottom row: add previous. Every one before that, change it to the previous
            var rowNum = newSchedule.cells.length - 1;
            for (var c = 0; c < newSchedule.cells[rowNum].length; c++){
                newSchedule.cells[rowNum][c].fte += newSchedule.cells[rowNum-1][c].fte;
            }
            //now loop backwards through the rows and shift the previous row's value to the current row's location
        
            for (var r = rowNum - 1; r > 0; r--){
                for (var c = 0; c < newSchedule.cells[rowNum].length; c++){
                    newSchedule.cells[r][c].fte = newSchedule.cells[r-1][c].fte;
                }
            }
            //zero out the first row
            for (var c = 0; c < newSchedule.cells[rowNum].length; c++){
                newSchedule.cells[0][c].fte = 0;
            }
        }
        this.schedules.push(newSchedule);   

    }
}