var blueButtonA = 51;
var blueButtonB = 56;
var yellowButtonA = 52;
var yellowButtonB = 50;

var IMAGE_A = 0,
    IMAGE_B = 1;


var playerBlue = {name: "azul", score: 0};
playerBlue[blueButtonA] = 0;
playerBlue[blueButtonB] = 1;

var playerYellow = {name: "amarelo", score: 0};
playerYellow[yellowButtonA] = 0;
playerYellow[yellowButtonB] = 1;

var players = [playerBlue, playerYellow];

var PRESS_START = 1,
    QUESTION = 2,
    ANSWER = 3,
    RESULT = 4,
    ANIMATING = 5;


var questions = [{
    images: ['images/question1/img1.jpg', 'images/question1/img2.jpg'],
    realImage: IMAGE_B
}, {
    images: ['images/question1/img1.jpg', 'images/question1/img2.jpg'],
    realImage: IMAGE_B
}, {
    images: ['images/question1/img1.jpg', 'images/question1/img2.jpg'],
    realImage: IMAGE_B
}, {
    images: ['images/question1/img1.jpg', 'images/question1/img2.jpg'],
    realImage: IMAGE_B
}, {
    images: ['images/question1/img1.jpg', 'images/question1/img2.jpg'],
    realImage: IMAGE_B
}];


var status = PRESS_START;
var questionId = 0;
var question;
var result;

$(document).ready(function () {
    render();
});


$(window).on('keydown', function (key) {
    if (status == PRESS_START) {
        status = QUESTION;
        question = questions[questionId];
        questionId++;
        render();
    }
    else if (status == QUESTION) {
        result = getResult(question, key.keyCode);
        if (result) {
            status = ANSWER;

            var otherPlayer = (1 - result.player);
            if (result.match) {
                players[result.player].score++;
            }
            else {
                players[otherPlayer].score++;
            }
            render();
        }
    }
    /*else if (status == ANSWER) {
        question = questions[questionId];
        questionId++;
        if (question) {
            status = QUESTION;
            render();
        }
        else {
            status = RESULT;
            render();
        }
    }*/
    else if (status == RESULT) {
        status = PRESS_START;
        players.forEach(function (p) {
            p.score = 0;
        });
        questionId = 0;
        render();
    }
});


function getResult(question, key) {
    var playerId = getPlayer(key);
    if (playerId === undefined) return null;
    if (players[playerId][key] == question.realImage) {
        return {player: playerId, match: true};
    }
    else {
        return {player: playerId, match: false};
    }

}

function getPlayer(key) {
    for (var i = 0; i < players.length; i++) {
        if (players[i][key] !== undefined) {
            return i;
        }
    }
}

function printQuestion(question) {
    $('#question').html('<h1>Pergunta numero ' + (questionId) + "</h1>");
    question.images.forEach(function (image) {
        $('#question').append('<img src="' + image + '">');
    });
}

function render() {
    if (status == PRESS_START) {
        $('#pressStart').fadeIn('slow');
    }
    else if (status == QUESTION) {
        $('#pressStart').fadeOut('slow');
        $('#answer').hide();
        printQuestion(question);
        $('#question').show();
    }
    else if (status == ANSWER){
        $('#answer').html("<h1>Player " + players[result.player].name + " " + (result.match ? "acertou" : "errou") + "!</h1>");
        status = ANIMATING;
        $('#answer').slideDown('slow', function(){
            setTimeout(function() {
                question = questions[questionId];
                questionId++;
                if (question) {
                    status = QUESTION;
                }
                else {
                    status = RESULT;
                }
                render();
            }, 3000);
        });

    }
    else if (status == RESULT) {
        $('#question').hide();
        $('#answer').hide();
        var $result = $('#result');
        $result.html('<h1>Resultado final</h1>' + JSON.stringify(players));
        $result.fadeIn('slow');
    }
}
