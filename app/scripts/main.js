$(function() {
	console.log('main.js');

	if(window.sessionStorage.getItem('isLoggedIn') && location.href.split('/')[3] !== 'home.html') {
		window.location.href = '/home.html';
	}
	login.init();
	home.init();

});