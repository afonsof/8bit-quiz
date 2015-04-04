class QuizManager {
    private players:Player[];
    private questions:Question[];

    private quizStatus:QuizStatusEnum = QuizStatusEnum.PRESS_START;
    private questionId:number = 0;
    private question:Question;
    private result;

    private renderer:Renderer;
    private videoHandler:VideoHandler;


    constructor(players:Player[], questions:Question[], renderer:Renderer, videoHandler:VideoHandler) {
        this.renderer = renderer;
        this.players = players;
        this.questions = questions;
        this.videoHandler = videoHandler;

        this.players[0][this.players[0].buttonA] = 0;
        this.players[0][this.players[0].buttonB] = 1;
        this.players[1][this.players[1].buttonA] = 0;
        this.players[1][this.players[1].buttonB] = 1;
    }

    ready() {
        this.render();
        this.bindKeydown();
        this.videoHandler.bindVideo();
    }

    private render() {
        var _this = this;
        this.renderer.render(this.quizStatus, this.question, this.result, this.questionId, function () {
            _this.question = _this.questions[_this.questionId];
            _this.questionId++;
            if (_this.question) {
                _this.quizStatus = QuizStatusEnum.QUESTION;
            } else {
                _this.quizStatus = QuizStatusEnum.RESULT;
            }
            _this.render();
        });

    }

    private bindKeydown() {
        var _this = this;

        $(window).on("keydown", function (key) {
            if (_this.quizStatus == QuizStatusEnum.PRESS_START) {
                _this.quizStatus = QuizStatusEnum.SELECT_PLAYER;
                _this.render();

            } else if (_this.quizStatus == QuizStatusEnum.SELECT_PLAYER) {
                for(var i = 0; i < 2; i++) {
                    if (key.keyCode == _this.players[i].buttonA || key.keyCode == _this.players[i].buttonB) {
                        _this.players[i].image = _this.videoHandler.snapPlayer(i);
                    }
                }
                _this.render();

                if (_this.players[0].image && _this.players[1].image) {
                    _this.quizStatus = QuizStatusEnum.QUESTION;
                    _this.question = _this.questions[_this.questionId];
                    _this.questionId++;
                }
                _this.render();
            } else if (_this.quizStatus == QuizStatusEnum.QUESTION) {
                _this.result = _this.getResult(_this.question, key.keyCode);
                if (_this.result) {
                    _this.quizStatus = QuizStatusEnum.ANSWER;

                    var otherPlayer = 1 - _this.result.player;
                    if (_this.result.match) {
                        _this.players[_this.result.player].score++;
                    } else {
                        _this.players[otherPlayer].score++;
                    }
                    _this.render();
                }
            } else if (_this.quizStatus == QuizStatusEnum.RESULT) {
                _this.quizStatus = QuizStatusEnum.PRESS_START;
                _this.players.forEach(function (player:Player) {
                    player.score = 0;
                });
                _this.questionId = 0;
                _this.render();
            }
        });

    }

    private getResult(question, key) {
        var playerId = this.getPlayer(key);
        if (playerId === undefined) {
            return null;
        }
        if (this.players[playerId][key] == question.realImage) {
            return {player: playerId, match: true};
        } else {
            return {player: playerId, match: false};
        }
    }

    private getPlayer(key) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i][key] !== undefined) {
                return i;
            }
        }
    }
}
