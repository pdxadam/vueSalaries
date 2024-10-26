import Cell from './Cell.js';
export default class Schedule{
    title = "New Schedule";
    rows = 0;
    cols = 0;
    colTitles = [];
    rowTitles = [];
    cells = [];

    constructor(title){
        this.title = title;
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
        console.log(s);
        return s;
    }
    getAnnualCost(){
        var totalCost = 0;
        for (let row of this.cells){
            for (let cell of row){
                totalCost += (cell.salary * cell.fte);
            }
        }
        return totalCost * 12;
    }
    addColumn(){
        this.cols++;
        this.colTitles.push("New");
        for(let row of this.cells){
            row.push(new Cell(0.0));
        }
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


}
