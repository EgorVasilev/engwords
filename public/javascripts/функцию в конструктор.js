console.log('hello world');

 $(document).ready(function() 
 {
	var stopGame = false;


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
stopGame = true;


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
// GET vocabularies
var getDictionary = function(callback) {
	var dictObj;
	var set = { "vbSet" : $('#vb-set').html().replace(/\s/g, '_').toLowerCase() , "gamemodeSet" : $('#gamemode-set').html(), "difficultySet" : $('#difficulty-set').html()};
	var url = "http://192.168.0.100:3000/api?dict=" + set.vbSet;
	$.getJSON(url , function( data ) {
		dictObj = data;
	}).done(function() {
		//callback(dictObj);
		gameloop(dictObj);
		timer.tik();
	}) 			
	
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
		clearInterval(this.tik);
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


var gameloop = function(currentDict) {

	var score = 0;
	var count = 0;
	var answer = '';
	var erase = false;
	var randomTask = random(currentDict);
	var randomType = randomTask[0];
	questWord = randomTask[1];
	var discr = currentDict[randomType][questWord];
	taskRender(randomType, questWord, discr);
	var reject = function() {
		randomTask = random(currentDict);
		randomType = randomTask[0];
		questWord = randomTask[1];
		discr = currentDict[randomType][questWord];
		taskRender(randomType, questWord, discr);
	}

	// function for clear answer input-field
	var checker = function() {
		if (erase) {
			$('#answer-input').val('');
			erase = false;
			reject();
			timer.time += 5;
			score += 5;
			$('#score-counter').html(score);

		}

		if (stopGame == true) {
		console.log('reject game');
		stopGame = false;
		timer.stop();
		$('#answer-input').val('');
		reject();
		return score;
	}
		
	}

	// function is watching for complete the quest word every 24ms
	var mainloop = setInterval(function() {
		checker();
	}, 24);

	var listener = document.getElementById("answer-input");
	listener.addEventListener("input", function(e) {
		var stringWatcher = $('#answer-input').val();
		var event = $('#answer-input').val();
			event = event.charCodeAt(event.length-1);

			console.log(event + ' event');
		if (answer.length < 1 && (event) > 64) {
			answer = String.fromCharCode(event).toLowerCase();
		}
		else if ((event) > 64) {
			answer += String.fromCharCode(event).toLowerCase();
			
		}
		console.log(stringWatcher.length + ' | watcher length');
		console.log(answer.length + ' | answer length');
		if (!event) {
			answer = '';
			progressbar(0, questWord);
		}
		if (answer.length > stringWatcher.length) {
			console.log('in cut area');
			answer = answer.slice(0, answer.length-2);
		}
		//if ((event.which == 8) && (answer.length < 1)) {
		//	answer = answer.slice(0, answer.length-3);
		//}
				console.log(answer + '|answer');
		if (answer.length == 0) {
			progressbar(0, questWord);
		}
		if (answer.length > 0) {
			if (questWord.slice(0, answer.length) == answer) {

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