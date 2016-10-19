var app = app || {};

app.main = (function() {

	$(document).ready(function() {

  (function($) {
    $('#header__icon').click(function(e){
      e.preventDefault();
      $('body').toggleClass('with--sidebar');
    });

    $('#site-cache').click(function(e){
      $('body').removeClass('with--sidebar');
    });

  })(jQuery);

  $("ul").on("click", "button", function(e) {
    e.preventDefault();
    var $parent = $(this).parent();
    var id = $(this).parent().attr('id');
    $.ajax({
      url: '/guests/' + id,
      type: 'DELETE',
      data: 'id: ' + id,
      dataType: 'json',
      context: this,
      success: function(result) {
        $parent.remove();
        $("#"+id).remove();
      },
      error: function(req, err){ console.log('my message is: ' + err); },
    });
  });

  $("#home").click(function(){
      $(".signup").css("display","none");
      $(".menuPage").css("display","none");
      $("#hero").css("display","block");
    });

  $("#menu").click(function(){
      $(".signup").css("display","none");
      $(".menuPage").css("display","block");
      $(".menuPage").css('min-height', '80vh');
      $("#hero").css("display","none");
    });

    $("#signup").click(function(){
      $(".signup").css("display","block");
      $(".signup").css('min-height', '40vh');
      $(".menuPage").css("display","none");
      $("#hero").css("display","none");
    });
});


	var init = function(){
		console.log('Initializing app.');
	};

	return {
		init: init
	};

})();

window.addEventListener('DOMContentLoaded', app.main.init);

