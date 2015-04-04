class Player {
    public constructor(name:string, buttonA:number, buttonB:number) {
        this.name = name;
        this.buttonA = buttonA;
        this.buttonB = buttonB;
        this.score = 0;
    }

    name:string;
    score:number;
    image:string;
    buttonA:number;
    buttonB:number;
}
