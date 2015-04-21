/// <reference path="jquery.d.ts" />
/// <reference path="lib.d.ts" />
/// <reference path="Renderer.ts" />
/// <reference path="VideoHandler.ts" />
/// <reference path="Core.ts" />

$(document).ready(function () {
    var players:Player[] = [
        new Player("Azul"),
        new Player("Amarelo")];

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
    },{
        images: ["images/question5/img1.jpg", "images/question5/img2.jpg"],
        realImage: ImagesEnum.IMAGE_B
    },{
        images: ["images/question5/img1.jpg", "images/question5/img2.jpg"],
        realImage: ImagesEnum.IMAGE_B
    },{
        images: ["images/question5/img1.jpg", "images/question5/img2.jpg"],
        realImage: ImagesEnum.IMAGE_B
    },{
        images: ["images/question5/img1.jpg", "images/question5/img2.jpg"],
        realImage: ImagesEnum.IMAGE_B
    },{
        images: ["images/question5/img1.jpg", "images/question5/img2.jpg"],
        realImage: ImagesEnum.IMAGE_B
    }];

    var quizStatus = new QuizStatus();
    var renderer = new Renderer(<HTMLCanvasElement>document.getElementById('game'), quizStatus, players);
    var videoHandler = new VideoHandler();
    var joystick = new Joystick([51, 56, 52, 50, 81]);

    var quizManager = new Core(quizStatus, players, questions, 5, renderer, videoHandler, joystick);
    quizManager.turnOn();
});
