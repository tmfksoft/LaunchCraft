global.lib = {};
global.functions = {};

global.lib.fs = require('fs');
global.lib.request = require('request');


global.functions.authenticate = function(username,password,cb) {
	$('#screen_login').fadeOut();
	$('#screen_loading').fadeIn();

	var mcdat = {"agent": {"name": "Minecraft","version": 1},"username": username,"password": password,"clientToken": "LaunchCraft"};
	$.ajax('https://authserver.mojang.com/authenticate',{
		'data': JSON.stringify(mcdat),
		'type': 'POST',
		'processData': false,
		'contentType': 'application/json'
	}).done(function(data){
		// Pull our info and put it into global.
		var curProfile = data.selectedProfile.id;
		
		var accounts = global.functions.getSetting("accounts");
		if (accounts==null) accounts = {};
		
		accounts[curProfile] = {};
		accounts[curProfile].uuid = data.availableProfiles[0].id;
		accounts[curProfile].username = data.availableProfiles[0].name;
		accounts[curProfile].accessToken = data.accessToken;
		
		global.functions.setSetting("accounts",accounts);
		
		cb(true,curProfile);
	}).fail(function(data) {
		// No workies!
		cb(false,data);
	});
}
global.functions.getSetting = function(id) {
	var item = localStorage.getItem(id.toLowerCase());
	if (item != null) return JSON.parse(item);
	return null;
}
global.functions.setSetting = function(id,data){
	localStorage.setItem(id.toLowerCase(),JSON.stringify(data));
}