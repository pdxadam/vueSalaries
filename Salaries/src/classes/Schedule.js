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
        this.cols = cols;
        var s = new Schedule(title);
        for (var row = 0; row < rows; row++){
            //an extra is being added because of titles
            rowTitles.push("Row " + row);
            cells.push([]);
            for (var col = 0; col <= columns; col++){
                    if (row == 0){ //only pop titles one time through
                        colTitles.push("Column " + col);
                    }
                
                    s.cells[col].push(new Cell(25.25));
                    s.cells[col][row].fte = 1.0;

            }
        }
        print(s);
        return s;
    }


}
