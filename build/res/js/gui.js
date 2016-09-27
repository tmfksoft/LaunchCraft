$(document).ready(function(){
	switchScreen("accounts");
	populateAccounts();
	document.title="Minecraft Open Launcher v0.1";

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
	
	$('.screen[window-id="login"] #login').mouseup(function(ev){
		var email = $('.screen[window-id="login"] #email').val();
		var password = $('.screen[window-id="login"] #password').val();
		if (email == "") {
			alert("Email/Username cannot be left blank!");
			return;
		}
		if (password == "") {
			alert("Password cannot be left blank!");
			return;
		}
		global.functions.authenticate(email,password,function(res,id){
			if (res) {
				global.functions.setSetting("currentAccount",id);
				populateAccounts();
				
				var accounts = global.functions.getSetting("accounts");
				var avatarUrl = "https://minotar.net/helm/"+accounts[id].username+"/49.png";
				$('.screen[window-id="main"] #accountAvatar').attr('src',avatarUrl);
				
				switchScreen("main");
			} else {
				alert("Error logging in!");
			}
		});
	});
	$('.screen[window-id="main"] #accountAvatar').click(function(ev){
		if (ev.button==0) {
			switchScreen("accounts");
		}
	});
	$('.accounts-container .account[data-type="account"]').mouseup(function(ev){
		if (ev.button == 0) {
			// Left Click			
			var accounts = global.functions.getSetting("accounts");
			var avatarUrl = "https://minotar.net/helm/"+accounts[$(this).attr("account-id")].username+"/49.png";
			$('.screen[window-id="main"] #accountAvatar').attr('src',avatarUrl);
			
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
function populateAccounts() {
	var accounts = global.functions.getSetting("accounts");
	if (accounts != null) {
		$('.screen[window-id="accounts"] .user-accounts').html('');
		for (var uuid in accounts) {
			var acc = accounts[uuid];
			$('.screen[window-id="accounts"] .user-accounts').append('<div class="account" data-type="account" account-id="'+acc.uuid+'"><span class="avatar"><img src="https://minotar.net/helm/'+acc.username+'/100.png"/></span><div class="extra"><span class="name">'+acc.username+'</span><span class="delete">Delete</span></div></div>');
		}
	}
}