/// <reference path="jquery.d.ts" />

class Renderer {
    private answerSection:JQuery;
    private questionsSection:JQuery;

    public constructor(private screen:HTMLElement, private status:QuizStatus, private players:Player[]) {
        var $screen = $(screen);
        $screen
            .html('')
            .addClass('quiz')
            .append('<div class="content">' +
            '<section id="pressStart">' +
                '<div><img src="images/logo.png"/></div>'+
                '<h1>Press Start</h1>' +
                '<h2>GAS Tecnologia (r) 2015</h2>' +
            '</section>' +
            '<section id="selectPlayer">' +
            '<h1>Alinhe a sua cabeça no círculo e pressione um botão</h1>' +
            '<video id="video" width="1440" height="1080" autoplay></video>' +
            '<img id="overlay" src="images/overlay-clip.svg">' +
            '<canvas id="thumb0" width="405" height="405" class="thumb"></canvas>' +
            '<canvas id="thumb1" width="405" height="405" class="thumb"></canvas>' +
            '</section>' +
            '<section id="question">' +
            '   <div id="score">' +
                    Renderer.createPlayerScoreHtml()+
                    Renderer.createPlayerScoreHtml()+
                '</div>' +
                '<h1>Pergunta numero <span class="questionNumber"/></h1>'+
                '<div id="questions">' +
                    '<div class="question"><img class="box" src="images/box.png"/><img class="button" src="images/button-a.gif"/></div>' +
                    '<div class="question"><img class="box" src="images/box.png"/><img class="button" src="images/button-b.gif"/></div>' +
                '</div>' +
            '</section>' +
            '<section id="answer"></section>' +
            '<section id="result"></section>' +
            '</div>');

        this.answerSection = $('#answer');
        this.questionsSection = $('#questions');
    }

    public render(onRenderEnd) {
        if (!onRenderEnd) onRenderEnd = function () {
        };

        switch (this.status.quizStatus) {
            case QuizStatusEnum.PRESS_START:
                this.renderPressStart(onRenderEnd);
                break;
            case QuizStatusEnum.SELECT_PLAYER:
                this.renderSelectPlayer(onRenderEnd);
                break;
            case QuizStatusEnum.QUESTION:
                this.renderQuestion(onRenderEnd);
                break;
            case QuizStatusEnum.ANSWER:
                this.renderAnswer(onRenderEnd);
                break;
            case QuizStatusEnum.RESULT:
                this.renderResult(onRenderEnd);
        }
    }

    private renderPressStart(onRenderEnd) {
        $("#question").removeClass('show');
        this.answerSection.removeClass('show');
        $("#selectPlayer").removeClass('show');
        $(".thumb").hide();
        $("#pressStart").addClass('show');
        onRenderEnd();
    }

    private renderSelectPlayer(onRenderEnd) {
        $("#pressStart").removeClass('show');
        $("#selectPlayer").addClass("show");
        if (this.players[0].image) {
            $('#thumb0').fadeIn('slow');
        }
        if (this.players[1].image) {
            $('#thumb1').fadeIn('slow');
        }
        onRenderEnd();
    }

    private renderQuestion(onRenderEnd) {
        this.renderScore();
        $("#selectPlayer").removeClass('show');
        this.printQuestion(this.status.question, this.status.questionId);
        $("#question").addClass('show');
        onRenderEnd();
    }

    private renderAnswer(onRenderEnd) {
        $('.question').addClass('hide');
        this.renderScore();

        this.answerSection.addClass('show');

        this.answerSection.html("<h1>Player " + this.players[this.status.currentPlayerId].name + " " +
        (this.status.isMatch ? "acertou" : "errou") + "!</h1>");

        setTimeout(()=>{
            onRenderEnd();
            $('.question').removeClass('hide');
            this.answerSection.removeClass('show');
        }, 3000);
    }

    private renderResult(onRenderEnd) {
        $("#question").removeClass('show');
        this.answerSection.removeClass('show');
        var $result = $("#result");
        $result.html("<h1>Resultado final</h1>" +
        "<table>" +
        "<tr>" +
        "<th bgcolor=\"blue\">Jogador " + this.players[0].name + "</th>" +
        "<th bgcolor=\"yellow\">Jogador" + this.players[1].name + "</th>" +
        "</tr>" +
        "<tr>" +
        "<td>" + this.players[0].score + " pontos</td>" +
        "<td>" + this.players[1].score + " pontos</td>" +
        "</tr>" +
        "</table>");

        $result.fadeIn("slow");
        onRenderEnd();
    }

    private renderScore() {
        var $players = $(".player-score");
        for(var i = 0; i < this.players.length; i++) {
            Renderer.renderPlayerScore($($players[i]), this.players[i]);
        }
    }

    private static renderPlayerScore($player:JQuery, player:Player){
        $player.find('.avatar').css("background-image", 'url('+ player.image + ')');
        $player.find('.life>div>div').removeClass().addClass('life-bar life-'+player.life);
        $player.find('.score').html(player.score + '');
        $player.find('.name>div').html(player.name + '');
    }

    private printQuestion(question, questionId) {
        $('.questionNumber').html(questionId);
        var $images = this.questionsSection.find('.question');
        for (var i = 0; i < question.images.length; i++) {
            $($images[i]).css('background-image', 'url(' + question.images[i] + ')');
        }
    }

    public static createPlayerScoreHtml(): string {
        return '<div class="player-score">' +
                    '<div class="avatar">' +
                        '<div class="box"/>' +
                    '</div>' +
                    '<div class="score"/>' +
                    '<div class="life">' +
                        '<div>' +
                            '<div class="life-bar"/>'+
                            '<div class="life-bar"/>'+
                        '</div>' +
                    '</div>'+
                    '<div class="name">' +
                        '<div class="shadow"/>' +
                        '<div class="text"/>' +
                    '</div>' +
                '</div>';
    }
}

