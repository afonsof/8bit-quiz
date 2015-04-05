/// <reference path="jquery.d.ts" />
/// <reference path="lib.d.ts" />
/// <reference path="Renderer.ts" />
/// <reference path="VideoHandler.ts" />
/// <reference path="QuizManager.ts" />

$(document).ready(function () {
    var players:Player[] = [
        new Player("azul"),
        new Player("amarelo")];

    var questions:Question[] = [{
        images: ["images/question1/img1.jpg", "images/question1/img2.jpg"],
        realImage: ImagesEnum.IMAGE_A
    }, {
        images: ["images/question2/img1.jpg", "images/question2/img2.jpg"],
        realImage: ImagesEnum.IMAGE_A
    }, {
        images: ["images/question3/img1.jpg", "images/question3/img2.jpg"],
        realImage: ImagesEnum.IMAGE_B
    }, {
        images: ["images/question4/img1.jpg", "images/question4/img2.jpg"],
        realImage: ImagesEnum.IMAGE_A
    }, {
        images: ["images/question5/img1.jpg", "images/question5/img2.jpg"],
        realImage: ImagesEnum.IMAGE_B
    }];

    var quizStatus = new QuizStatus();
    var renderer = new Renderer(players);
    var videoHandler = new VideoHandler();
    var joystick = new Joystick([51, 56, 52, 50, 81]);

    var quizManager = new QuizManager(quizStatus, players, questions, 5, renderer, videoHandler, joystick);
    quizManager.turnOn();
});
