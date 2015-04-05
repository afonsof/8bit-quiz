class QuizStatus {
    questionId:number;
    question:Question;
    currentPlayerId:number;
    isMatch;
    quizStatus:QuizStatusEnum;
    gameQuestions:Question[];
}

class QuizManager {

    constructor(public status:QuizStatus,
                private players:Player[],
                private questions:Question[],
                private questionCount:number,
                private renderer:Renderer,
                private videoHandler:VideoHandler,
                private joystick:Joystick) {
    }

    turnOn() {
        this.videoHandler.bindVideo();
        this.joystick.bind((playerId:PlayersEnum, button:JoystickButtonsEnum) => {

            if(button == JoystickButtonsEnum.ButtonReset){
                this.resetGame();
                return;
            }

            this.status.currentPlayerId = playerId;
            switch (this.status.quizStatus) {
                case QuizStatusEnum.PRESS_START:
                    this.startGame();
                    break;
                case QuizStatusEnum.SELECT_PLAYER:
                    this.selectPlayer(playerId);
                    break;
                case QuizStatusEnum.QUESTION:
                    this.processAnswer(playerId, button);
                    break;
                case QuizStatusEnum.RESULT:
                    this.resetGame();
            }
        });
        this.resetGame();
    }

    private render(callback?:any) {
        this.renderer.render(this, callback);
    }

    private startGame():void {
        this.status.quizStatus = QuizStatusEnum.SELECT_PLAYER;
        this.render();
    }

    private selectPlayer(playerId:PlayersEnum):void {
        if (playerId === undefined) {
            return;
        }
        this.players[playerId].image = this.videoHandler.snapPlayer(playerId);
        this.render({currentPlayerId: playerId});

        if (this.players[0].image && this.players[1].image) {
            this.processNextQuestion();
        }
    }

    private resetGame():void {
        this.status.quizStatus = QuizStatusEnum.PRESS_START;
        this.status.questionId = 0;
        this.players.forEach(function (player:Player) {
            player.score = 0;
            player.image = null;
        });
        var temp = this.questions.slice(0);
        this.status.gameQuestions = [];

        for (var i = 0; i < this.questionCount; i++) {
            this.status.gameQuestions.push(temp.splice(Math.floor(Math.random() * temp.length), 1)[0]);
        }
        this.render();
    }

    private processAnswer(playerId:PlayersEnum, button:JoystickButtonsEnum):void {
        if (playerId === undefined) {
            return;
        }
        this.status.isMatch = QuizManager.IsMatch(this.status.question, button);
        this.status.quizStatus = QuizStatusEnum.ANSWER;

        var otherPlayer = 1 - playerId;
        if (this.status.isMatch) {
            this.players[playerId].score++;
        } else {
            this.players[otherPlayer].score++;
        }
        this.render(() => {
            this.processNextQuestion();
        });

    }

    private processNextQuestion():void {
        this.status.question = this.status.gameQuestions[this.status.questionId];
        this.status.questionId++;
        if (this.status.question) {
            this.status.quizStatus = QuizStatusEnum.QUESTION;
        } else {
            this.status.quizStatus = QuizStatusEnum.RESULT;
        }
        this.render();
    }

    private static IsMatch(question, button:JoystickButtonsEnum):boolean {
        return !!
            (button === JoystickButtonsEnum.ButtonA && question.realImage === ImagesEnum.IMAGE_A ||
            button === JoystickButtonsEnum.ButtonB && question.realImage === ImagesEnum.IMAGE_B);
    }
}
