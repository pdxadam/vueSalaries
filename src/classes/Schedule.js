import Cell from './Cell.js';
import * as ExcelJS from 'exceljs';

export default class Schedule{

    //We should change perMember to perFTE. perMember woudld require additional data.
    //TODO: Add a feature to consider inflation

    title = "New Schedule";
    description = "";
    durationInMonths = 12;
    rows = 0;
    cols = 0;
    colTitles = [];
    rowTitles = [];
    cells = [];
    additionalCosts = [];
    insurance = 0;
    
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
        let newSchedule = new Schedule(temp.title);
        newSchedule.description = temp.description;
        newSchedule.insurance = temp.insurance;
        newSchedule.rows = temp.rows;
        newSchedule.cols = temp.cols;
        newSchedule.colTitles = temp.colTitles;
        newSchedule.rowTitles = temp.rowTitles;
        newSchedule.cells = temp.cells;
        if (temp.additionalCosts){
            newSchedule.additionalCosts = temp.additionalCosts;
        }
        else{
            newSchedule.additionalCosts = [];
        }
        return newSchedule;
    }
    getSalaryCost(){
        var totalCost = 0;
        for (let row of this.cells){
            for (let cell of row){
                totalCost += (cell.salary * cell.fte);
            }
        }
        return totalCost * (this.durationInMonths / 12);
    }
    calcAssociatedSalary(associatedPercent){
        return this.getSalaryCost() * (1 + associatedPercent/100);
    }
    calcFullyAllocatedCost(associatedPercent){
        return this.calcAssociatedSalary(associatedPercent) + this.calcInsuranceCost() + this.calculateAdditionalCosts();
    }
    getAnnualCost(){
        return this.getSalaryCost() + this.calcInsuranceCost() + this.calculateAdditionalCosts();
    }
    setInsurance(monthlyContribution){
        this.insurance = monthlyContribution;
    }

    addColumn(){
        this.cols++;
        this.colTitles.push("New");
        for(let row of this.cells){
            let newCell = new Cell(0.0);
            newCell.fte = 0;

            row.push(newCell);
        }
    }
    countFTE(){
        let count = 0;
        let countCells = 0;
        for (var row of this.cells){            
            for (var cell of row){
                count += parseFloat(cell.fte);
                countCells++;
            }
        }
        return count;
    }
    calcInsuranceCost(){
        let totalFTE = parseFloat(this.countFTE());
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
                newSchedule.cells[rowNum][c].fte =  parseFloat(newSchedule.cells[rowNum][c].fte) + parseFloat(newSchedule.cells[rowNum-1][c].fte);
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
    adjustSalaries(percentage){
        //I am currentlye not using this one.
    //go through every cell and add the percentage.
        
        for (var row = 0; row < this.cells.length; row++){
            for (var col = 0; col < this.cells[row].length; col++){
                
                let newSalary = this.cells[row][col].salary * (1 + percentage/100);
                this.cells[row][col].salary = Math.round(newSalary * 100)/100;
            }
        }
    }
    addAdditionalCost(title, amount, timesPerYear = 1, perMember = false){
        //adds an additional lump costs entry to this schedule. Assumes it is an annual cost (1x per year)
        //e.g. 
        this.additionalCosts.push({"title":title, "amount":amount, "timesPerYear": timesPerYear, "perMember": perMember});
    }
    calculateAdditionalCosts(){
        let total = 0;
        
        for (let cost of this.additionalCosts){
            let thisCost = (cost.amount * cost.timesPerYear);
            if (cost.perMember){
                thisCost *= this.countFTE();
            }
            total += thisCost;
        }
        return total;
    }
}
