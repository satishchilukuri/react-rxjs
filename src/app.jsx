"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Rx = require("rx-lite");

var UserView = require("./components/UserView.jsx");
var UserStore = require("./stores/UserStore.js");
var UserIntent = require("./intents/UserIntent.js");

UserIntent.observe(UserView);
UserStore.observe(UserIntent);


ReactDOM.render(<UserView store={UserStore}/>, document.getElementById("content"));