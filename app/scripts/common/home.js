var home = (function() {
	'use strict';

	function _getUserEmail() {
		return JSON.parse(window.sessionStorage.getItem('data')).email;
	}

	function _submitNote(args) {
		$.ajax({
			type: 'POST',
			url: 'http://restful-api-.herokuapp.com/api/'+ _getUserEmail() +'/notes',
			data: args,
			success: function(data) {
				$(':input[type="submit"]').prop('disabled', false);
				console.log('Note added!', data);
			},
			error: function(err) {
				console.log('ERROR in submit note!', err);
			}
		});
	}

	function _tagsRailInit() {
		$('.tags-rail li').on('click', function() {

			var me = $(this);
			$('.tags-rail li').removeClass('active');
			$(this).addClass('active');

			if(me.data('id') === 'All') {
				$('.tile-wrap').removeClass('hide');
			} else {
				$('.tile-wrap').addClass('hide');
				$('.tile-wrap').map(function() {

					if(me.data('id') === $(this).data('id')) {
						$(this).removeClass('hide');
					}

				});
			}
		});
	}

	function _customEqualizer() {
          $('.tiles:visible').css('height',''); // To compensate paddings
          var maxHeight = Math.max.apply(null, $('.tiles:visible').map(function ()
          {
          	return $(this).height();
          }).get());
          $('.tiles:visible').height(maxHeight); // To compensate paddings
      }

      function _removeDuplicateTags(originalArray, objKey) {
      	var trimmedArray = [];
      	var values = [];
      	var value;

      	for(var i in originalArray) {
      		value = originalArray[i][objKey];

      		if(values.indexOf(value) === -1) {
      			trimmedArray.push(originalArray[i]);
      			values.push(value);
      		}
      	}

      	return trimmedArray;
      }

      function _renderMyNotes() {
      	$.ajax({
      		type: 'GET',
      		url: 'http://restful-api-.herokuapp.com/api/'+ _getUserEmail() +'/notes',
      		success: function(data) {
      			console.log('Your Notes!', data);
      			if(data.length) {
      				var $top_template = $('#notes-template').html();
      				var $tags_rail = $('#tags-rail-item').html();

      				$('.tiles-body').append(Mustache.render($top_template, data));
      				$('.tags-rail').append(Mustache.render($tags_rail, _removeDuplicateTags(data,'tag'))).removeClass('v-hidden');
      				_tagsRailInit();
      				_customEqualizer();
      			}
      		},
      		error: function(err) {
      			console.log('ERROR in submit note!', err);
      		}
      	});
      }

      function _invokeEffects() {
      	$('#new-note').on('click', function() {
      		var tag = $('#tag').val();
      		var text = $('#note-text').val();

      		if(tag && text) {
      			$(':input[type="submit"]').prop('disabled', true);
      			_submitNote({tag: tag, note: text});
      		} else {
      			console.log('Please Fill Values');
      		}
      	});

      	$('.navbar-text').on('click', function() {
      		window.sessionStorage.removeItem('data');
      		window.sessionStorage.removeItem('isLoggedIn');
      		location.href = '/';
      	});
      }

      function init() {
      	_invokeEffects();
      	if($('body').hasClass('homepage')) {
      		_renderMyNotes();
      	}
      }

      return {
      	init: init
      };

  }());
