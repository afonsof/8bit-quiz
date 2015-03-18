var questions = [{
	images: ['images/question1/img1.jpg', 'images/question1/img2.jpg'],
	realImage: 1
}];

var players = [{
	49: 0,
	50: 1
},
{
	51: 0,
	52: 1
}];

var questionId = -1;
var question;

$(document).ready(function(){
	printStartScreen();
});

function nextQuestion(){
	question = questions[questionId];
	printQuestion(question);
}

$(window).on('keypress', function(key){
	if(questionId == -1){
		questionId = 0;
		nextQuestion();
		return;
	}
	var result = getResult(question, key.keyCode);
	if(result) {
		alert("Player " + result.player + " " + (result.match?"acertou":"errou"));
		questionId++;
		question = questions[questionId];
		if(question) {
			nextQuestion();
		}
		else{
			alert('There\'s no more questions');
			questionId = -1;
			printStartScreen();
		}
	}
});



function getResult(question, key){
	var playerId = getPlayer(key);
	if(players[playerId][key] == question.realImage) {
			return { player: playerId, match: true };
	}
	else {
			return { player: playerId, match: false };
	}
		
}

function getPlayer(key) {
	for(var i = 0; i < players.length; i++) {
		if(players[i][key] !== undefined) {
			return i;
		}
	}
}

function printQuestion(question) {
	$('#images').html('');
	question.images.forEach(function(image){
		$('#images').append('<img src="'+ image + '">');
	});
}

function printStartScreen(){
	$('#images').html('Pressione qualquer tecla para comecar');
}