console.log('hello world');

 $(document).ready(function() 
 {
	var gameloopController = {
	game: null,
	create: function(obj) {
		game = new Gameloop(obj);
		game.init();
	},
	delete: function() {
		game = null;
	}
}


// game options dropdown buttons //

    $('li.words-list-li').click(function(e) 
    { 
     $('button#words-list').find('span:first').html($(this).text()+ ' ');
    });

    $('li.game-mode-li').click(function(e) 
    { 
     $('button#game-mode').find('span:first').html($(this).text()+ ' ');
    });
    $('li.difficulty-li').click(function(e) 
    { 
     $('button#difficulty').find('span:first').html($(this).text()+ ' ');
    });


// start and stop buttons

$('#start').click( function() {

	getDictionary();

	
//visualisation
	$('.app-display').css('max-width', '900px');
	$('.discr, .options').slideUp('slow', function() {
		$('.registration').fadeOut('slow', function() {
			$('.header-active, .current-vb > p').css('visibility', 'visible');
			$('.header-active').css('opacity', '1');
			$('.main-active').css('display', 'block');
			
		});

	});
});

$('#stop').click( function() {
	alert('you get: ' + game.score + ' points');
	gameloopController.delete();
	timer.stop();


// visualisation	
	$('.app-display').css('max-width', '600px');
	$('.main-active').slideUp('slow', function() {

		$('.discr, .options').slideDown('fast', function() {
			$('#timer').html('01:30');
			$('.header-active').css('opacity', '0');
			$('.registration').fadeIn('slow');
			$('.header-active, .current-vb > p').css('visibility', 'hidden');

		});
	});
});
$('#skip-btn').click( function() {
	game.skip();
})
// GET dictionaries
var getDictionary = function(callback) {
	var dictObj;
	var set = { "vbSet" : $('#vb-set').html().replace(/\s/g, '_').toLowerCase() , "gamemodeSet" : $('#gamemode-set').html(), "difficultySet" : $('#difficulty-set').html()};
	var urlReq = "https://engtrainer.herokuapp.com/api?dict=" + set.vbSet;
	$.ajax({
  		url: urlReq,
  		crossDomain: true
		}).done(function() {
		  	gameloopController.create(dictObj);
			console.log(game);
			timer.tik();
	})

/*
	$.getJSON(url , function( data ) {
		dictObj = data;
	}).done(function() {
		//callback(dictObj);
		
		gameloopController.create(dictObj);
		console.log(game);
		timer.tik();
	}) 
	*/			
	
};


// timer

var timer =  {
	time: 90,
	 
	tik: function() { 
		console.log('tik launched');
		this.interval = setInterval(function() { timer.countdown(); }, 1000);
	},
	
	timeRender: function() {
		var minutes = parseInt(this.time/60);
		if (minutes < 9) {
			minutes = '0' + minutes;
		}
		var seconds = this.time;
		if (this.time > 59) {
			while (seconds > 59) {
				seconds -= 60;
			}
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		} 
		return minutes + ':' + seconds;
	},
	countdown: function() {
		this.time -= 1;
		$('#timer').html(this.timeRender());
		if (this.time < 1) {
			clearInterval(this.interval);
		}
		},
	stop: function(){
		clearInterval(this.interval);
		this.time = 90;
	}
}



// progress bar


var progressbar = function(curProg, word) {
	var barSteps = (100 / word.length) * curProg;
	console.log(barSteps + ' !');
	$('.progress-bar').css('width', barSteps+'%');
}

// ENGLISH KEY-SCANNER 

var scanner = function(keyCode) {

	// ENGLISH KEYS

	if ((keyCode > 64) && (keyCode < 91)) {
		keyCode += 32;
	}
	return keyCode;
}
var random = function(obj) {

	// [ 'nount || verb || adj' ,  'random word']
	var randomArr;
	var randomType;
	var randomProperty = function (obj) {
    	var keys = Object.keys(obj)
    	return keys[ keys.length * Math.random() << 0];
	};
	var randomWord = function(obj) {
		var keys = Object.keys(obj)

		return keys[ keys.length * Math.random() << 0];
	}
	randomType = randomProperty(obj);
	randomArr = [randomType, randomWord(obj[randomType])];
	console.log('random arr  ' + randomArr);
	return randomArr;

}
 var taskRender = function(type, word, discr) {
 	$('.answer-tips').html(type);
 	$('#first-letter').html(word.charAt(0).toUpperCase());
 	console.log(discr);
 	$('#word-discr').html(discr);
 	$('#answer-input').attr('placeholder', word.charAt(0).toUpperCase());
 }


var Gameloop = function(currentDict) {
	this.dict = currentDict;
	var gameId = this;
	this.score = 0;
	this.count = 0;
	this.answer = '';
	this.erase = false;
	
	this.init = function() {
		gameId.randomTask = random(this.dict);
		gameId.randomType = gameId.randomTask[0];
		gameId.questWord = gameId.randomTask[1];
		gameId.discr = gameId.dict[gameId.randomType][gameId.questWord];
		taskRender(gameId.randomType, gameId.questWord, gameId.discr);

		$('#answer-input').val('');
		$('#score-counter').html(gameId.score);
		$('#answer').css('background-color' , 'transparent');
		$('#answer').html('_');
	}
	this.reject = function() {
		gameId.randomTask = random(this.dict);
		gameId.randomType = gameId.randomTask[0];
		gameId.questWord = gameId.randomTask[1];
		gameId.discr = gameId.dict[gameId.randomType][gameId.questWord];
		taskRender(gameId.randomType, gameId.questWord, gameId.discr);
	}
	this.skip = function() {
		$('#answer-input').val('');
		gameId.score -= 5;
		$('#score-counter').html(gameId.score);
		$('#answer').html(gameId.answer);
		$('#answer').css('background-color' , '#E4EECC');
		gameId.count = 0;
		gameId.answer = '';
		progressbar(gameId.count, gameId.questWord);
		gameId.reject();

	}
	// function for clear answer input-field
	this.checker = function() {
		if (gameId.erase) {
			$('#answer-input').val('');
			gameId.erase = false;
			gameId.reject();
			timer.time += 5;
			gameId.score += 5;
			$('#score-counter').html(gameId.score);

		}		
	}

	// function is watching for complete the quest word every 24ms
	this.mainloop = setInterval(function() {
		gameId.checker();
	}, 24);

	this.listener = document.getElementById("answer-input");
	this.listener.addEventListener("input", function(e) {
		var stringWatcher = $('#answer-input').val();
		var event = $('#answer-input').val();
			event = event.charCodeAt(event.length-1);

			console.log(event + ' event');


			//   ДОБАВЬ ОБРАБОТКУ ЦИФР


		if (gameId.answer.length < 1 && (event) > 31) {
			gameId.answer = String.fromCharCode(event).toLowerCase();
		}
		else if ((event) > 31) {
			gameId.answer += String.fromCharCode(event).toLowerCase();
			
		}
		console.log(stringWatcher.length + ' | watcher length');
		console.log(gameId.answer.length + ' | answer length');
		if (!event) {
			gameId.answer = '';
			progressbar(0, gameId.questWord);
		}
		if (gameId.answer.length > stringWatcher.length) {
			console.log('in cut area');
			gameId.answer = gameId.answer.slice(0, gameId.answer.length-2);
		}
		//if ((event.which == 8) && (answer.length < 1)) {
		//	answer = answer.slice(0, answer.length-3);
		//}
				console.log(gameId.answer + '|answer');
		if (gameId.answer.length == 0) {
			progressbar(0, gameId.questWord);
		}
		if (gameId.answer.length > 0) {
			if (gameId.questWord.slice(0, gameId.answer.length) == gameId.answer) {

			$('.progress-bar-success').css('background-color' , '#5cb85c');
			gameId.count = gameId.answer.length;
			progressbar(gameId.count, gameId.questWord)
				if (gameId.questWord.length == gameId.answer.length) {
					$('#answer').html(gameId.answer);
					$('#answer').css('background-color' , '#E4EECC');
					gameId.count = 0;
					gameId.answer = '';
					progressbar(gameId.count, gameId.questWord);
					gameId.erase = true
				}
			}
			else {
				$('.progress-bar-success').css('background-color' , 'red');
			}
			
		}
	}, false);
	/* $('#answer-input').keyup(function(event) {
		if (answer.length < 1 && (event.which) > 64) {
			answer = String.fromCharCode(event.which).toLowerCase();
		}
		else if ((event.which) > 64) {
			answer += String.fromCharCode(event.which).toLowerCase();
			
		}
		// backspace listener
		if (event.which == 8) {
			answer = answer.slice(0, answer.length-1);
		}
		//if ((event.which == 8) && (answer.length < 1)) {
		//	answer = answer.slice(0, answer.length-3);
		//}

		if (answer.length == 0) {
			progressbar(0, questWord);
		}
		if (answer.length > 0) {
			if (questWord.slice(0, answer.length) == answer) {
			console.log(' in check block');
			console.log(questWord.slice(0, answer.length) + ' first');
			console.log(answer + ' second');
			$('.progress-bar-success').css('background-color' , '#5cb85c');
			count = answer.length;
			progressbar(count, questWord)
				if (questWord.length == answer.length) {
					$('#answer').html(answer);
					$('#answer').css('background-color' , '#E4EECC');
					count = 0;
					answer = '';
					progressbar(count, questWord);
					erase = true
				}
			}
			else {
				$('.progress-bar-success').css('background-color' , 'red');
			}
			
		}
		
	}); */
	
}









});