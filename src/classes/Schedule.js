import Cell from './Cell.js';
export default class Schedule{
    //TODO: Update Schedule View to handle the duration component
    //TODO: Include an 'add-on costs' section
    //TODO: Add an 'associated payroll costs' feature -- is that by schedule or by scenario? 
    //TODO: Add a feature to consider inflation

    title = "New Schedule";
    description = "";
    durationInMonths = 12;
    rows = 0;
    cols = 0;
    colTitles = [];
    rowTitles = [];
    cells = [];
    insurance = 10285;
    constructor(title, description = ""){
        this.title = title;
        this.description = description;
        }
    static SeedSchedule(title, rows, columns){
        this.rows = rows;
        this.cols = columns;
        var s = new Schedule(title);
        for (var row = 0; row < rows; row++){
            //an extra is being added because of titles
            s.rowTitles.push("Row " + row);
            s.cells.push([]); // add a row
            for (var col = 0; col <= columns; col++){
                if (row == 0){ //only pop titles one time through
                    s.colTitles.push("Column " + col);
                }
            
                s.cells[row].push(new Cell(25.25));
                s.cells[row][col].fte = 1.0;

            }
        }
        return s;
    }

    static fromJsonSchedule(json){
        if (json == null || json == ""){
            return null; //not a good structure
        }
        let temp = JSON.parse(json);
        if (temp == null){
            return;
        }
        if (temp.title == null){
            return;
        }
        //should check that it has the right structure. 
        let newCal = new Schedule(temp.title);
        newCal.rows = temp.rows;
        newCal.cols = temp.cols;
        newCal.colTitles = temp.colTitles;
        newCal.rowTitles = temp.rowTitles;
        newCal.cells = temp.cells;
        return newCal;
    }
    getSalaryCost(){
        var totalCost = 0;
        for (let row of this.cells){
            for (let cell of row){
                totalCost += (cell.salary * cell.fte);
            }
        }
        return totalCost * this.durationInMonths;
    }
    getAnnualCost(){
        return this.getSalaryCost() + this.calcInsuranceCost();
    }
    setInsurance(monthlyContribution){
        this.insurance = monthlyContribution;
    }
    addColumn(){
        this.cols++;
        this.colTitles.push("New");
        for(let row of this.cells){
            row.push(new Cell(0.0));
        }
    }
    countFTE(){
        var count = 0;
        for (var row of this.cells){            
            for (var cell of row){
                count += cell.fte;
            }
        }
        return count;
    }
    calcInsuranceCost(){
        let totalFTE = this.countFTE();
        return totalFTE * this.insurance * this.durationInMonths;
    }
    addRow(seq = -1){
        //default to last. 
     
        this.rowTitles.push("new Row");
        let oldRow = JSON.parse(JSON.stringify(this.cells[this.cells.length - 1]));
        this.cells.push(oldRow);
        this.rows++;
        
    }
    removeColumn(index){
        if (index < 0 || index >= this.cells[0].length){ 
            return;
        }
        for (var n = 0; n < this.cells.length; n++){
            this.cells[n].splice(index, 1);
        }
        this.colTitles.splice(index, 1);
    }
    removeRow(index){
        if (index < 0 || index >= this.cells.length){
            return;
        }
        this.cells.splice(index, 1);
        this.rowTitles.splice(index, 1);
    }
    copySchedule(newTitle, percentage, advanceFTE = true){
        //returns a fresh copy of this schedule and advances it accordingly
        
        let desc = "Adds " + percentage + "% to '" + this.title;
        if (advanceFTE){
            desc += "' and advances FTE.";
        }
        else{
            desc += "' and does not advance FTE"
        }
        var newSchedule = Schedule.fromJsonSchedule(JSON.stringify(this));
        newSchedule.description = desc;
        //go through every cell and add the percentage.
        for (var row = 0; row < newSchedule.cells.length; row++){
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
        return newSchedule;
    }


}
