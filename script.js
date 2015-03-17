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


$(document).ready(function(){
	var question = questions.pop();
	$('#images').html('');
	question.images.forEach(function(image){
		$('#images').append('<img src="'+ image + '">');
	});
	
	$(window).on('keypress', function(key){
		players.forEach(function(player, i){
		alert(player[key.keyCode]);
			if(player[key.keyCode] !== undefined && player[key.keyCode] == question.realImage) {
				alert('player '+ i +' acertou');
			}
			else{
				alert('player '+ i +' errou');
			}
		});
	});
});