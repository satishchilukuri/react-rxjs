"use strict";

var Rx = require("rx-lite");
var AppConstants = require('../constants/AppConstants.js');

var RESOURCE_URL = "http://localhost:3000/users/";
// var RESOURCE_URL = "http://jsonplaceholder.typicode.com/users/";

var Userstore = {};
Userstore.updates = new Rx.Subject();

function sendUpdate(data) {    
    Userstore.updates.onNext(data);
}

function load() {
    $.ajax(RESOURCE_URL).done(function(data) {
    	sendUpdate(data);
    })
}

function create(user) {
	$.ajax({
        url: RESOURCE_URL,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(user)
    }).done(function() {
    	load();
    }).fail(function(jqXHR, textStatus, errorThrown ) {
    	console.log(errorThrown);
    });
}

function del(userId) {
	$.ajax({
        url: RESOURCE_URL + userId,
        dataType: 'json',
        type: 'DELETE'
    }).done(function() {
    	load();
    }).fail(function(jqXHR, textStatus, errorThrown ) {
    	console.log(errorThrown);
    });
}

Userstore.observe = function(intent) {
    intent.actions.subscribe(function(actionEvent) {
        switch(actionEvent.action) {
            case AppConstants.LOAD:
                load();
                break;
            case AppConstants.CREATE:
                create(actionEvent.data);
                break;
            case AppConstants.DELETE:
                del(actionEvent.data);
                break;
            default:
            // no op
        }
    });
};

module.exports = Userstore;