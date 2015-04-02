/// <reference path="jquery.d.ts" />
/// <reference path="lib.d.ts" />
"use strict";

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

class Question {
    images:string[];
    realImage:number;
}

enum QuizStatus{
    PRESS_START = 1,
    QUESTION = 2,
    ANSWER = 3,
    RESULT = 4,
    ANIMATING = 5,
    SELECT_PLAYER = 6,
}

enum Images{
    IMAGE_A = 0,
    IMAGE_B = 1
}

class Renderer {
    public constructor(players: Player[]){
        this.players = players;
    }

    private players;

    public render(quizStatus, question, result, questionId, answerQuestionTimeout) {
        var $answerSection = $('#answer');

        switch (quizStatus) {
            case QuizStatus.PRESS_START:
                Renderer.renderPressStart();
                break;
            case QuizStatus.SELECT_PLAYER:
                Renderer.renderSelectPlayer(this.players);
                break;
            case QuizStatus.QUESTION:
                Renderer.renderQuestion($answerSection, this.players, question, questionId);
                break;
            case QuizStatus.ANSWER:
                Renderer.renderAnswer($answerSection, this.players, result, answerQuestionTimeout);
                break;
            case QuizStatus.RESULT:
                Renderer.renderResult($answerSection, this.players);
        }
    }

    private static renderPressStart() {
        $("#result").hide();
        $("#pressStart").fadeIn("slow");
    }

    private static renderSelectPlayer(players) {
        $("#pressStart").fadeOut();
        $("#selectPlayer").fadeIn("slow");
        if (players[0].image) {
            $('#thumb0').show();
        }
        if (players[1].image) {
            $('#thumb1').show();
        }
    }

    private static renderQuestion($answerSection, players, question, questionId) {
        $("#selectPlayer").fadeOut(3000);
        $answerSection.hide();
        Renderer.renderScore(players);
        Renderer.printQuestion(question, questionId);
        $("#question").fadeIn(3000);
    }

    private static renderAnswer($answerSection, players, result, answerQuestionTimeout) {
        //todo: Resolver: quizStatus = QuizStatus.ANIMATING;
        $answerSection.html("<h1>Player " + players[result.player].name + " " + (result.match ? "acertou" : "errou") + "!</h1>");
        $answerSection.slideDown("slow", function () {
            setTimeout(answerQuestionTimeout, 3000);
        });
    }

    private static renderResult($answerSection, players) {
        $("#question").hide();
        $answerSection.hide();
        var $result = $("#result");
        $result.html("<h1>Resultado final</h1><table><tr><th bgcolor=\"blue\">Jogador " + players[0].name + "</th>" +
        "<th bgcolor=\"yellow\">Jogador" + players[1].name + "</th></tr><tr><td>" + players[0].score +
        " pontos</td><td>" + players[1].score + " pontos</td></tr></table>");

        $result.fadeIn("slow");
    }

    private static renderScore(players:Player[]) {
        var $pb = $("#playerBlue");
        $pb.find("img").attr("src", players[0].image);
        $pb.find("span").html(players[0].score.toString());

        var $py = $("#playerYellow");
        $py.find("img").attr("src", players[1].image);
        $py.find("span").html(players[1].score.toString());
    }

    private static printQuestion(question, questionId) {
        $("#questions").html("<h1>Pergunta numero " + questionId + "</h1>");
        question.images.forEach(function (image) {
            $("#questions").append("<img class=\"option\" src=\"" + image + "\">");
        });
    }
}

class VideoHandler {
    private video;
    private canvas0;
    private canvas1;
    private context0;
    private context1;
    private videoObj;
    private errBack;


    public bindVideo():void {

        var _this = this;

        window.addEventListener("DOMContentLoaded", function () {
            // Grab elements, create settings, etc.
            _this.canvas0 = document.getElementById("thumb0");
            _this.context0 = _this.canvas0.getContext("2d");
            _this.canvas1 = document.getElementById("thumb1");
            _this.context1 = _this.canvas1.getContext("2d");

            _this.video = document.getElementById("video");
            _this.videoObj = {video: true};
            _this.errBack = function (error) {
                console.log("Video capture error: ", error.code);
            };

            // Put video listeners into place
            if (navigator.getUserMedia) {
                // Standard
                navigator.getUserMedia(_this.videoObj, function (stream) {
                    _this.video.src = stream;
                    _this.video.play();
                }, _this.errBack);
            } else if (navigator.webkitGetUserMedia) {
                // WebKit-prefixed
                navigator.webkitGetUserMedia(_this.videoObj, function (stream) {
                    _this.video.src = window.webkitURL.createObjectURL(stream);
                    _this.video.play();
                }, _this.errBack);
            } else if (navigator.mozGetUserMedia) {
                // WebKit-prefixed
                navigator.mozGetUserMedia(_this.videoObj, function (stream) {
                    _this.video.src = window.URL.createObjectURL(stream);
                    _this.video.play();
                }, _this.errBack);
            }
        }, false);

    }

    snapPlayer0():string {
        this.context0.drawImage(this.video, 360, 146, 187, 187, 0, 0, 405, 405);
        return this.canvas0.toDataURL("image/jpeg");
    }

    snapPlayer1():string {
        this.context1.drawImage(this.video, 91, 146, 187, 187, 0, 0, 405, 405);
        return this.canvas1.toDataURL("image/jpeg");
    }
}

class QuizManager {
    private players:Player[];
    private questions;

    private quizStatus = QuizStatus.PRESS_START;
    private questionId = 0;
    private question;
    private result;

    private renderer:Renderer;
    private videoHandler:VideoHandler;


    constructor(players:Player[], questions, renderer:Renderer, videoHandler:VideoHandler) {
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
                _this.quizStatus = QuizStatus.QUESTION;
            } else {
                _this.quizStatus = QuizStatus.RESULT;
            }
            _this.render();
        });

    }

    private bindKeydown() {
        var _this = this;

        $(window).on("keydown", function (key) {
            if (_this.quizStatus == QuizStatus.PRESS_START) {
                _this.quizStatus = QuizStatus.SELECT_PLAYER;
                _this.render();

            } else if (_this.quizStatus == QuizStatus.SELECT_PLAYER) {
                if (key.keyCode == _this.players[0].buttonA || key.keyCode == _this.players[0].buttonB) {
                    this.players[0].image = _this.videoHandler.snapPlayer0();
                }
                if (key.keyCode == _this.players[1].buttonA || key.keyCode == _this.players[1].buttonB) {
                    this.players[1].image = _this.videoHandler.snapPlayer1();
                }
                _this.render();

                if (_this.players[0].image && _this.players[1].image) {
                    _this.quizStatus = QuizStatus.QUESTION;
                    _this.question = _this.questions[_this.questionId];
                    _this.questionId++;
                }
                _this.render();
            } else if (_this.quizStatus == QuizStatus.QUESTION) {
                _this.result = _this.getResult(_this.question, key.keyCode);
                if (_this.result) {
                    _this.quizStatus = QuizStatus.ANSWER;

                    var otherPlayer = 1 - _this.result.player;
                    if (_this.result.match) {
                        _this.players[_this.result.player].score++;
                    } else {
                        _this.players[otherPlayer].score++;
                    }
                    _this.render();
                }
            } else if (_this.quizStatus == QuizStatus.RESULT) {
                _this.quizStatus = QuizStatus.PRESS_START;
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

var players:Player[] = [
    new Player("azul", 51, 56),
    new Player("amarelo", 52, 50)];

var questions:Question[] = [{
    images: ["images/question1/img1.jpg", "images/question1/img2.jpg"],
    realImage: Images.IMAGE_A
}, {
    images: ["images/question2/img1.jpg", "images/question2/img2.jpg"],
    realImage: Images.IMAGE_A
}, {
    images: ["images/question3/img1.jpg", "images/question3/img2.jpg"],
    realImage: Images.IMAGE_B
}, {
    images: ["images/question4/img1.jpg", "images/question4/img2.jpg"],
    realImage: Images.IMAGE_A
}, {
    images: ["images/question5/img1.jpg", "images/question5/img2.jpg"],
    realImage: Images.IMAGE_B
}];

var quizManager = new QuizManager(players, questions, new Renderer(players), new VideoHandler());

$(document).ready(function () {
    quizManager.ready();
});
