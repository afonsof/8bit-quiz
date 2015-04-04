/// <reference path="jquery.d.ts" />
/// <reference path="lib.d.ts" />
/// <reference path="Renderer.ts" />
/// <reference path="VideoHandler.ts" />
/// <reference path="QuizManager.ts" />

var players:Player[] = [
    new Player("azul", 51, 56),
    new Player("amarelo", 52, 50)];

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

$(document).ready(function () {
    var quizManager = new QuizManager(players, questions, new Renderer(players), new VideoHandler());
    quizManager.ready();
});
