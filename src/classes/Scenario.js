class Scenario{
    title = "new Scenario";
    description = "Description";
    schedules = [];

    contructor(title, description){
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

    getTotalCost(){
        //adds up the total cost of the shedules in this scenario
        var total = 0;
        for (var s in this.schedules){
            total += s.getAnnualCost();
        }
        return total;
    }

    advanceLast(newTitle, percentage, advanceFTE = true){
        var newSchedule = Schedule.fromJson(this.schedules[this.schedules.length - 1]);
        //go through every cell and add the percentage.
        for (var row = 0; row < newSchedule.cells.length; row++){
            for (var col = 0; col < newSchedule.cells[row].length; col++){
                newSchedule.cells[row][col].salary *= (1 + percentage);
            }
        }
        newSchedule.title = newtitle;
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
        }
        this.schedules.push(newSchedule);   

    }
}