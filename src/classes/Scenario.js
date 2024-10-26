class Scenario{
    title = "new Scenario";
    description = "Description";
    schedules = [];
    contructor(title, description){
        this.title = title;
        this.description = description;
    }
    getTotalCost(){
        total = 0;
        for (var s in this.schedules){
            total += s.getAnnualCost();
        }
        return total;
    }
}