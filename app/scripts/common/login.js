var login = (function() {
	'use strict';
	function _submitSignupForm() {
		$(':input[type="submit"]').prop('disabled', true);
		var data = {
			name: $('#name').val().trim(),
			email: $('#email').val().trim(),
			password: $('#password').val(),
		};

		$.ajax({
			type: 'POST',
			url: 'http://restful-api-.herokuapp.com/api/' + data.email +'/profile',
			data: data,
			success: function(d) {
				$(':input[type="submit"]').prop('disabled', false);
				location.href = '/';
			},
			error: function(err) {
				console.log('Error', err);
			}
		});
	}

	function _checkUser(email) {
		var value;
		$.ajax({
			type: 'GET',
			url: 'http://restful-api-.herokuapp.com/api/'+email+'/profile',
			async: false,
			success: function(d) {
				//console.log('The data:', d);
				value = d;
			},
			error: function(d) {
				console.log('error data', d);
			}
		});
		return value;
	}

	function _checkPassword(pass, user) {
		return (user[0].password === pass) ? true : false;
	}

	function _setUserSession(user) {
		window.sessionStorage.setItem('isLoggedIn', true);
		window.sessionStorage.setItem('data', JSON.stringify({name: user[0].name, email: user[0].email}));
		return true;
	}

	function _invokeEvents() {

		$('#logMeIn').on('click', function(e) {
			e.preventDefault();
			$(':input[type="submit"]').prop('disabled', true);

			var email = $('#email').val();
			var pass = $('#password').val();

			if(email && pass) {
				var user = _checkUser(email);
				if(user.length) {
					console.log('yes user');
					if(_checkPassword(pass, user)) {
						if(_setUserSession(user)) {
							location.href = '/home.html';
						}
					} else {
						$(':input[type="submit"]').prop('disabled', false);
						console.log('denied');
					}
				} else {
					console.log('Nope');
				}
			} else {
				console.log('no');
				$(':input[type="submit"]').prop('disabled', false);
			}
		});

		$('#signup').on('click',function(e) {
			e.preventDefault();

			var $name = $('#name');
			var $email = $('#email');
			var $pass = $('#password');
			var $cPass = $('#confirmPassword');
			var emailRegex = /\S+@\S+\.\S+/;

			if(	$name.val() && $email.val() && $pass.val() && $cPass.val()) {
				if(emailRegex.test($email.val())) {
					if(_checkUser($email.val().trim()).length) {
						console.log('user Already Exist');
					} else {
						if($pass.val() === $cPass.val()) {
							_submitSignupForm();
						} else {
							console.log('denied');
						}
					}
				} else {
					console.log('email false');
				}
			} else {
				console.log('false');
			}

		});
	}

	function init() {
		_invokeEvents();
	}

	return {
		init: init
	};

}());
