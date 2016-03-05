"use strict";

var Rx = require("rx-lite");
var AppConstants = require('../constants/AppConstants.js');
var ActionEvent = require('../util/ActionEvent.js')

var UserIntent = {};

UserIntent.actions = new Rx.Subject();

UserIntent.observe = function(reactComponent) {
    reactComponent.getLoadUsers().subscribe(function() {
        UserIntent.actions.onNext(new ActionEvent(AppConstants.LOAD, null));
    });
    reactComponent.getDeleteUser().subscribe(function(id) {
        UserIntent.actions.onNext(new ActionEvent(AppConstants.DELETE, id));
    });
    reactComponent.getCreateUser().subscribe(function(name) {
        UserIntent.actions.onNext(new ActionEvent(AppConstants.CREATE, {
            id: Math.floor((Math.random() * 1000) + 10),
            name: name
        }));
    });
};

module.exports = UserIntent;