function jobDes(){

	var job = document.getElementById('title');

	if(job.classList.contains('beenClicked') == false){
		job.insertAdjacentHTML('beforeend',"<h1 style='color:white'>Developer || Designer</h1>");
	}

	job.className += ' beenClicked';
}


$(document).ready(function(){

	(function($) {
		$('#header__icon').click(function(e){
			e.preventDefault();
			$('body').toggleClass('with--sidebar');
		});

		$('#site-cache').click(function(e){
			$('body').removeClass('with--sidebar');
		});

	})(jQuery);

});