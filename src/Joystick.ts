enum JoystickButtonsEnum{
    ButtonA,
    ButtonB,
    ButtonReset
}

enum PlayersEnum{
    Player0,
    Player1
}

class Joystick {
    private buttons = {};
    private players = {};

    public constructor(keyMap:number[]){
        this.buttons[keyMap[0]] = JoystickButtonsEnum.ButtonA;
        this.buttons[keyMap[1]] = JoystickButtonsEnum.ButtonB;
        this.buttons[keyMap[2]] = JoystickButtonsEnum.ButtonA;
        this.buttons[keyMap[3]] = JoystickButtonsEnum.ButtonB;
        this.buttons[keyMap[4]] = JoystickButtonsEnum.ButtonReset;

        this.players[keyMap[0]] = PlayersEnum.Player0;
        this.players[keyMap[1]] = PlayersEnum.Player0;
        this.players[keyMap[2]] = PlayersEnum.Player1;
        this.players[keyMap[3]] = PlayersEnum.Player1;
    }

    public bind(callback) {
        $(window).on("keydown", (key) => {
            var button:JoystickButtonsEnum = this.buttons[key.keyCode];
            if(button !== undefined){
                var playerId:PlayersEnum = this.players[key.keyCode];
                callback(playerId, button);
            }
            else {
                callback();
            }
        });
    }
}
