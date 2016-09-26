$(document).ready(function(){
	switchScreen("login");
	document.title="Minecraft Open Launcher v0.1";
	$('#login').click(function(){
		switchScreen("main");
	});
	$('.navbar .item').mouseup(function(){
		$('.navbar .item').removeClass("active");
		$(this).addClass("active");
	});
	$('.accounts-container .account[data-type="add"]').mouseup(function(){
		switchScreen("login");
	});
	$('.screen[window-id="login"] #back').mouseup(function(ev){
		if (ev.button==0) switchScreen("accounts");
	});
	$('.accounts-container .account[data-type="account"]').mouseup(function(ev){
		if (ev.button == 0) {
			// Left Click
			switchScreen("main");
		} else if (ev.button == 2) {
			// Right Click
			var name = $(this).attr("account-name");
			$(this).addClass("selected");
			/*$('.accounts-container .account[account-name="'+name+'"] .name').fadeOut(function(){
				$('.accounts-container .account[account-name="'+name+'"] .delete').fadeIn();
			});
			*/
		}
	});
	$('img').on("error",function(){
		alert("IMG ERR");
	});
});

function switchScreen(id) {
	$('.screen.active').fadeOut().removeClass("active");
	$('.screen[window-id="'+id+'"').fadeIn().addClass("active");
}