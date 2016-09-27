global.lib = {};
global.functions = {};
global.prefs = {}; // Can be overriden by the existence of preferences.json

global.lib.fs = require('fs');
global.lib.request = require('request');
global.lib.gui = require('nw.gui');

global.prefs.dataDir = process.env.APPDATA+"\\.launchcraft";

global.functions.authenticate = function(username,password,cb) {
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
		accounts[curProfile].clientToken = "LaunchCraft";
		accounts[curProfile].login = username;
		
		global.functions.setSetting("accounts",accounts);
		
		cb(true,curProfile);
	}).fail(function(data) {
		// No workies!
		data = JSON.parse(data.responseText);
		cb(false,data);
	});
}
// Checks if an accounts token is still valid
global.functions.validateSession = function(uuid,cb){
	var acc = global.functions.getAccount(uuid);
	if (acc == null) {
		cb(null);
		return;
	}
	
	var mcdat = {"accessToken":acc.accessToken,"clientToken":acc.clientToken};
	$.ajax('https://authserver.mojang.com/validate',{
		'data': JSON.stringify(mcdat),
		'type': 'POST',
		'processData': false,
		'contentType': 'application/json'
	}).done(function(data,code,req){
		// Pull our info and put it into global.
		console.log(data,req);
		if (req.status == 204) {
			cb(true);
		} else {
			cb(false);
		}
	}).fail(function(data) {
		// No workies!
		console.log(data);
		cb(false);
	});
}
global.functions.refreshSession = function(uuid,cb){
	var acc = global.functions.getAccount(uuid);
	if (acc == null) {
		cb(null);
		return;
	}
	var mcdat = {"accessToken":acc.accessToken,"clientToken":acc.clientToken};
	console.log(mcdat);
	$.ajax('https://authserver.mojang.com/refresh',{
		'data': JSON.stringify(mcdat),
		'type': 'POST',
		'processData': false,
		'contentType': 'application/json'
	}).done(function(data,code,req){
		// Pull our info and put it into global.
		if (req.status == 200) {
			console.log(data);
			acc.accessToken = data.accessToken;
			global.functions.setAccount(acc.id,acc);
			cb(true);
		} else {
			cb(false);
		}
	}).fail(function(data) {
		// No workies!
		console.log(data);
		cb(false);
	});
}

// File download function borrow from SmallChat
global.functions.downloadFile = function(url, options, encoding){
	var prot = null
	if (url.substr(0,5) == "https") {
		prot = global.https;
	} else {
		prot = global.http;
	}
	var file = null;
	if ('file' in options) file = global.fs.createWriteStream(options.file);
	
	var request = prot.get(url, function(response) {
		if (encoding){
			response.setEncoding(encoding);
		}
		var len = parseInt(response.headers['content-length'], 10);
		if (file!=null) response.pipe(file);
		var body = "";
		var cur = 0;
		var total = len / 1048576; //1048576 - bytes in  1Megabyte
		
		if ('start' in options) options.start(total);
		
		response.on("data", function(chunk) {
			//body += chunk;
			cur += chunk.length;
			//console.log("Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb\r" + ".<br/> Total size: " + total.toFixed(2) + " mb");
			if ('progress' in options) options.progress( (100.0 * cur / len).toFixed(2) );
		});

		file.on("close", function() {
			if ('end' in options) {
				if ('file' in options) {
					options.end(options.file);
				} else {
					options.end();
				}
			}
			//console.log("Downloading complete");
		});

		request.on("error", function(e){
			if ('error' in options) options.error(e.message);
			console.log("Error: " + e.message);
		});

	});
};
global.functions.getAccount = function(uuid) {
	var accounts = global.functions.getSetting("accounts");
	if (accounts==null) return null;
	if (typeof accounts[uuid] != "undefined") return accounts[uuid];
	return null;	
}
global.functions.setAccount = function(uuid,data) {
	var accounts = global.functions.getSetting("accounts");
	if (accounts==null) return false;
	if (typeof accounts[uuid] != "undefined") {
		accounts[uuid] = data;
		global.functions.setSetting("accounts",accounts);
		return true;
	}
}
global.functions.getSetting = function(id) {
	var item = localStorage.getItem(id.toLowerCase());
	if (item != null) return JSON.parse(item);
	return null;
}
global.functions.setSetting = function(id,data){
	localStorage.setItem(id.toLowerCase(),JSON.stringify(data));
}