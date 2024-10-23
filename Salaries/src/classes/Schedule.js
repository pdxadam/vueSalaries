export default class Schedule{
    title = "New Schedule";
    salary = [[]];
    constructor(title){
        this.title = title;
    }
    static SeedSchedule(title, rows, columns){
        var s = new Schedule(title);
        for (var row = 0; row <= rows; row++){
            //an extra is being added because of titles
            for (var col = 0; col <= columns; col++){
                if (col == 0 && row==0){
                    s.salary[col][row] = "Schedule";
                }
                else if (row == 0){
                    s.salary[col][row] = "Column";
                }
                else if (col == 0){
                    s.salary[col][row] = "25.15";
                }
            }
        }
        return s;
    }


}
