class QuizStatus {
    questionId:number;
    question:Question;
    currentPlayerId:number;
    isMatch;
    quizStatus:QuizStatusEnum;
    gameQuestions:Question[];
}

class Core {
    private tick:number;
    private questionCount:number;

    constructor(public status:QuizStatus,
                private players:Player[],
                private questions:Question[],
                private lifeSize:number,
                private renderer:Renderer,
                private videoHandler:VideoHandler,
                private joystick:Joystick) {
        this.questionCount = (lifeSize * 2) - 1;
    }

    turnOn():void {
        this.videoHandler.bindVideo();
        this.joystick.bind((playerId:PlayersEnum, button:JoystickButtonsEnum) => {

            if (button == JoystickButtonsEnum.ButtonReset) {
                this.resetGame();
                return;
            }

            this.status.currentPlayerId = playerId;
            switch (this.status.quizStatus) {
                case QuizStatusEnum.PRESS_START:
                    this.goToSelectPlayer();
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

    private render(callback?:any):void {
        this.renderer.render(callback);
    }

    private goToSelectPlayer():void {
        this.status.quizStatus = QuizStatusEnum.SELECT_PLAYER;
        this.render();
    }

    private selectPlayer(playerId:PlayersEnum):void {
        if (playerId === undefined) {
            return;
        }
        this.players[playerId].image = this.videoHandler.snapPlayer(playerId);
        this.render();

        if (this.players[0].image && this.players[1].image) {
            this.processNextQuestion();
        }
    }

    private resetGame():void {
        this.status.quizStatus = QuizStatusEnum.PRESS_START;
        this.status.questionId = 0;
        this.players.forEach(function (player:Player) {
            player.life = 5;
            player.image = null;
            player.score = 0;
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
        this.status.isMatch = Core.IsMatch(this.status.question, button);
        this.status.quizStatus = QuizStatusEnum.ANSWER;

        var otherPlayer = 1 - playerId;
        if (this.status.isMatch) {
            this.players[otherPlayer].life--;
            var duration = Core.getTick() - this.tick
            this.players[playerId].score += duration < 5000 ? 5000 - duration : 0;
        } else {
            this.players[playerId].life--;
        }
        this.render(() => {
            this.processNextQuestion();
        });

    }

    private processNextQuestion():void {
        this.tick = Core.getTick();
        this.status.question = this.status.gameQuestions[this.status.questionId];
        this.status.questionId++;

        if (this.isEveryoneAlive() && this.status.question) {
            this.status.quizStatus = QuizStatusEnum.QUESTION;
        } else {
            this.processFinish();
        }
        this.render();
    }

    private processFinish():void {
        this.status.quizStatus = QuizStatusEnum.RESULT;

        var scores = JSON.parse(localStorage.getItem('scores'));
        if (!scores) scores = [];
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            //give 10k to the winner
            if (player.life > 0) {
                player.score += 10000;
            }

            scores.push({
                image: player.image,
                score: player.score,
                life: player.life
            });
        }
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    private static IsMatch(question, button:JoystickButtonsEnum):boolean {
        return !!
            (button === JoystickButtonsEnum.ButtonA && question.realImage === ImagesEnum.IMAGE_A ||
            button === JoystickButtonsEnum.ButtonB && question.realImage === ImagesEnum.IMAGE_B);
    }

    private static getTick():number {
        return new Date().getTime();
    }

    private isEveryoneAlive():boolean {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].life === 0) {
                return false;
            }
        }
        return true;
    }
}
