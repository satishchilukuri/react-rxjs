(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Rx = require("rx-lite");

var UserView = require("./components/UserView.jsx");
var UserStore = require("./stores/UserStore.js");
var UserIntent = require("./intents/UserIntent.js");

UserIntent.observe(UserView);
UserStore.observe(UserIntent);

ReactDOM.render(React.createElement(UserView, { store: UserStore }), document.getElementById("content"));

},{"./components/UserView.jsx":2,"./intents/UserIntent.js":4,"./stores/UserStore.js":5,"react":"react","react-dom":"react-dom","rx-lite":"rx-lite"}],2:[function(require,module,exports){
"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var Rx = require("rx-lite");

var loadUsers = new Rx.Subject();
var _deleteUser = new Rx.Subject();
var createUser = new Rx.Subject();

var UserView = React.createClass({
    displayName: 'UserView',

    statics: {
        getLoadUsers: function getLoadUsers() {
            return loadUsers;
        },
        getDeleteUser: function getDeleteUser() {
            return _deleteUser;
        },
        getCreateUser: function getCreateUser() {
            return createUser;
        }
    },
    getInitialState: function getInitialState() {
        return { users: [] };
    },
    updates: null,
    componentDidMount: function componentDidMount() {
        this.updates = this.props.store.updates.subscribe((function (data) {
            this.setState({ users: data });
        }).bind(this));
        loadUsers.onNext();
    },
    componentWillUnmount: function componentWillUnmount() {
        this.updates.dispose();
    },
    deleteUser: function deleteUser(id, e) {
        e.preventDefault();
        _deleteUser.onNext(id);
    },
    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var firstName = ReactDOM.findDOMNode(this.refs.firstName).value;
        var lastName = ReactDOM.findDOMNode(this.refs.lastName).value;

        if (firstName === "" || lastName === "") {
            alert("First and last name are required");
            return;
        }
        createUser.onNext(firstName + " " + lastName);
    },
    render: function render() {

        var users = [];
        if (this.state.users) {
            this.state.users.forEach((function (user, i) {
                users.push(React.createElement(
                    'tr',
                    { key: i },
                    React.createElement(
                        'td',
                        null,
                        user.name
                    ),
                    React.createElement(
                        'td',
                        null,
                        React.createElement('input', { type: 'button', className: 'btn btn-default btn-sm', value: 'Delete', onClick: this.deleteUser.bind(null, user.id) })
                    )
                ));
            }).bind(this));
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'nav',
                { className: 'navbar navbar-default' },
                React.createElement(
                    'div',
                    { className: 'container-fluid' },
                    React.createElement(
                        'div',
                        { className: 'navbar-header' },
                        React.createElement(
                            'button',
                            { type: 'button', className: 'navbar-toggle collapsed', 'data-toggle': 'collapse', 'data-target': '#bs-example-navbar-collapse-1', 'aria-expanded': 'false' },
                            React.createElement(
                                'span',
                                { className: 'sr-only' },
                                'Toggle navigation'
                            ),
                            React.createElement('span', { className: 'icon-bar' }),
                            React.createElement('span', { className: 'icon-bar' }),
                            React.createElement('span', { className: 'icon-bar' })
                        ),
                        React.createElement(
                            'a',
                            { className: 'navbar-brand', href: '#' },
                            'Model-View-Intent with React-RxJS'
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'panel panel-default' },
                React.createElement(
                    'div',
                    { className: 'panel-heading' },
                    'Users'
                ),
                React.createElement(
                    'table',
                    { className: 'table' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                { className: 'col-md-3' },
                                'User name'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Action'
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        users
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-md-4' },
                    React.createElement(
                        'h3',
                        null,
                        'Create new user'
                    ),
                    React.createElement(
                        'form',
                        { onSubmit: this.handleSubmit },
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                { htmlFor: 'firstName' },
                                'First name:'
                            ),
                            React.createElement('input', { type: 'text', className: 'form-control', maxLength: '128', ref: 'firstName', id: 'firstName' })
                        ),
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement(
                                'label',
                                { htmlFor: 'lastName' },
                                'Last name:'
                            ),
                            React.createElement('input', { type: 'text', className: 'form-control', maxLength: '128', ref: 'lastName', id: 'lastName' })
                        ),
                        React.createElement(
                            'div',
                            { className: 'form-group' },
                            React.createElement('input', { type: 'submit', className: 'btn btn-default', value: 'Submit' })
                        )
                    )
                )
            )
        );
    }
});

module.exports = UserView;
/* Header */ /*/.navbar-header */ /*/.container-fluid */ /* User List */ /* Form for creating new user */

},{"react":"react","react-dom":"react-dom","rx-lite":"rx-lite"}],3:[function(require,module,exports){
"use strict";

var AppConstants = {
    CREATE: "create",
    DELETE: "delete",
    LOAD: "load"
};

module.exports = AppConstants;

},{}],4:[function(require,module,exports){
"use strict";

var Rx = require("rx-lite");
var AppConstants = require('../constants/AppConstants.js');
var ActionEvent = require('../util/ActionEvent.js');

var UserIntent = {};

UserIntent.actions = new Rx.Subject();

UserIntent.observe = function (reactComponent) {
    reactComponent.getLoadUsers().subscribe(function () {
        UserIntent.actions.onNext(new ActionEvent(AppConstants.LOAD, null));
    });
    reactComponent.getDeleteUser().subscribe(function (id) {
        UserIntent.actions.onNext(new ActionEvent(AppConstants.DELETE, id));
    });
    reactComponent.getCreateUser().subscribe(function (name) {
        UserIntent.actions.onNext(new ActionEvent(AppConstants.CREATE, {
            id: Math.floor(Math.random() * 1000 + 10),
            name: name
        }));
    });
};

module.exports = UserIntent;

},{"../constants/AppConstants.js":3,"../util/ActionEvent.js":6,"rx-lite":"rx-lite"}],5:[function(require,module,exports){
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
    $.ajax(RESOURCE_URL).done(function (data) {
        sendUpdate(data);
    });
}

function create(user) {
    $.ajax({
        url: RESOURCE_URL,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(user)
    }).done(function () {
        load();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    });
}

function del(userId) {
    $.ajax({
        url: RESOURCE_URL + userId,
        dataType: 'json',
        type: 'DELETE'
    }).done(function () {
        load();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    });
}

Userstore.observe = function (intent) {
    intent.actions.subscribe(function (actionEvent) {
        switch (actionEvent.action) {
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

},{"../constants/AppConstants.js":3,"rx-lite":"rx-lite"}],6:[function(require,module,exports){
"use strict";

function ActionEvent(action, data) {
    this.action = action;
    this.data = data;
}

module.exports = ActionEvent;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9zYXRpc2gvRGVza3RvcC9yZWFjdC10dXQvc3JjL2FwcC5qc3giLCIvaG9tZS9zYXRpc2gvRGVza3RvcC9yZWFjdC10dXQvc3JjL2NvbXBvbmVudHMvVXNlclZpZXcuanN4IiwiL2hvbWUvc2F0aXNoL0Rlc2t0b3AvcmVhY3QtdHV0L3NyYy9jb25zdGFudHMvQXBwQ29uc3RhbnRzLmpzIiwiL2hvbWUvc2F0aXNoL0Rlc2t0b3AvcmVhY3QtdHV0L3NyYy9pbnRlbnRzL1VzZXJJbnRlbnQuanMiLCIvaG9tZS9zYXRpc2gvRGVza3RvcC9yZWFjdC10dXQvc3JjL3N0b3Jlcy9Vc2VyU3RvcmUuanMiLCIvaG9tZS9zYXRpc2gvRGVza3RvcC9yZWFjdC10dXQvc3JjL3V0aWwvQWN0aW9uRXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRTVCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3BELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2pELElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztBQUVwRCxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRzlCLFFBQVEsQ0FBQyxNQUFNLENBQUMsb0JBQUMsUUFBUSxJQUFDLEtBQUssRUFBRSxTQUFTLEFB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WUFBSSxFQUFFLENBQUM7S0FDUCxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUc7QUFDakQsZUFBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUN6QixDQUFDLENBQUM7Q0FDTjs7QUFFRCxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVMsTUFBTSxFQUFFO0FBQ2pDLFVBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVMsV0FBVyxFQUFFO0FBQzNDLGdCQUFPLFdBQVcsQ0FBQyxNQUFNO0FBQ3JCLGlCQUFLLFlBQVksQ0FBQyxJQUFJO0FBQ2xCLG9CQUFJLEVBQUUsQ0FBQztBQUNQLHNCQUFNO0FBQUEsQUFDVixpQkFBSyxZQUFZLENBQUMsTUFBTTtBQUNwQixzQkFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixzQkFBTTtBQUFBLEFBQ1YsaUJBQUssWUFBWSxDQUFDLE1BQU07QUFDcEIsbUJBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsc0JBQU07QUFBQSxBQUNWLG9CQUFROztTQUVYO0tBQ0osQ0FBQyxDQUFDO0NBQ04sQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQzs7O0FDakUzQixZQUFZLENBQUM7O0FBRWIsU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUMvQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztDQUNwQjs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBSZWFjdERPTSA9IHJlcXVpcmUoJ3JlYWN0LWRvbScpO1xudmFyIFJ4ID0gcmVxdWlyZShcInJ4LWxpdGVcIik7XG5cbnZhciBVc2VyVmlldyA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvVXNlclZpZXcuanN4XCIpO1xudmFyIFVzZXJTdG9yZSA9IHJlcXVpcmUoXCIuL3N0b3Jlcy9Vc2VyU3RvcmUuanNcIik7XG52YXIgVXNlckludGVudCA9IHJlcXVpcmUoXCIuL2ludGVudHMvVXNlckludGVudC5qc1wiKTtcblxuVXNlckludGVudC5vYnNlcnZlKFVzZXJWaWV3KTtcblVzZXJTdG9yZS5vYnNlcnZlKFVzZXJJbnRlbnQpO1xuXG5cblJlYWN0RE9NLnJlbmRlcig8VXNlclZpZXcgc3RvcmU9e1VzZXJTdG9yZX0vPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpKTsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcbnZhciBSeCA9IHJlcXVpcmUoXCJyeC1saXRlXCIpO1xuXG52YXIgbG9hZFVzZXJzID0gbmV3IFJ4LlN1YmplY3QoKTtcbnZhciBkZWxldGVVc2VyID0gbmV3IFJ4LlN1YmplY3QoKTtcbnZhciBjcmVhdGVVc2VyID0gbmV3IFJ4LlN1YmplY3QoKTtcblxudmFyIFVzZXJWaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgZ2V0TG9hZFVzZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2FkVXNlcnM7XG4gICAgICAgIH0sXG4gICAgICAgIGdldERlbGV0ZVVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZVVzZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENyZWF0ZVVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVVzZXI7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7dXNlcnM6IFtdfTtcbiAgICB9LFxuICAgIHVwZGF0ZXM6IG51bGwsXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkgeyAgICAgICAgXG4gICAgICAgIHRoaXMudXBkYXRlcyA9IHRoaXMucHJvcHMuc3RvcmUudXBkYXRlcy5zdWJzY3JpYmUoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlcnM6IGRhdGF9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgbG9hZFVzZXJzLm9uTmV4dCgpO1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZXMuZGlzcG9zZSgpO1xuICAgIH0sXG4gICAgZGVsZXRlVXNlcjogZnVuY3Rpb24oaWQsIGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkZWxldGVVc2VyLm9uTmV4dChpZCk7XG4gICAgfSxcbiAgICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgZmlyc3ROYW1lID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLmZpcnN0TmFtZSkudmFsdWU7XG4gICAgICAgIHZhciBsYXN0TmFtZSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5sYXN0TmFtZSkudmFsdWU7XG5cbiAgICAgICAgaWYgKGZpcnN0TmFtZSA9PT0gXCJcIiB8fCBsYXN0TmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgYWxlcnQoXCJGaXJzdCBhbmQgbGFzdCBuYW1lIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjcmVhdGVVc2VyLm9uTmV4dChmaXJzdE5hbWUgKyBcIiBcIiArIGxhc3ROYW1lKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIHVzZXJzID0gW107XG4gICAgICAgIGlmKHRoaXMuc3RhdGUudXNlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudXNlcnMuZm9yRWFjaChmdW5jdGlvbiAodXNlciwgaSkge1xuICAgICAgICAgICAgICAgIHVzZXJzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt1c2VyLm5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIiB2YWx1ZT1cIkRlbGV0ZVwiIG9uQ2xpY2s9e3RoaXMuZGVsZXRlVXNlci5iaW5kKG51bGwsIHVzZXIuaWQpfS8+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgey8qIEhlYWRlciAqL31cbiAgICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1iYXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tYmFyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWJhclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiI1wiPk1vZGVsLVZpZXctSW50ZW50IHdpdGggUmVhY3QtUnhKUzwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PnsvKi8ubmF2YmFyLWhlYWRlciAqL31cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ey8qLy5jb250YWluZXItZmx1aWQgKi99XG4gICAgICAgICAgICAgICAgPC9uYXY+XG5cbiAgICAgICAgICAgICAgICB7LyogVXNlciBMaXN0ICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5Vc2VyczwvZGl2PiAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cImNvbC1tZC0zXCI+VXNlciBuYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAge3VzZXJzfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBGb3JtIGZvciBjcmVhdGluZyBuZXcgdXNlciAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+Q3JlYXRlIG5ldyB1c2VyPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZmlyc3ROYW1lXCI+Rmlyc3QgbmFtZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBtYXhMZW5ndGg9XCIxMjhcIiByZWY9XCJmaXJzdE5hbWVcIiBpZD1cImZpcnN0TmFtZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJsYXN0TmFtZVwiPkxhc3QgbmFtZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBtYXhMZW5ndGg9XCIxMjhcIiByZWY9XCJsYXN0TmFtZVwiIGlkPVwibGFzdE5hbWVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdmFsdWU9XCJTdWJtaXRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gVXNlclZpZXc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBcHBDb25zdGFudHMgPSB7XG4gICAgQ1JFQVRFOiBcImNyZWF0ZVwiLFxuICAgIERFTEVURSA6IFwiZGVsZXRlXCIsXG4gICAgTE9BRCA6IFwibG9hZFwiXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ29uc3RhbnRzOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUnggPSByZXF1aXJlKFwicngtbGl0ZVwiKTtcbnZhciBBcHBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvQXBwQ29uc3RhbnRzLmpzJyk7XG52YXIgQWN0aW9uRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsL0FjdGlvbkV2ZW50LmpzJylcblxudmFyIFVzZXJJbnRlbnQgPSB7fTtcblxuVXNlckludGVudC5hY3Rpb25zID0gbmV3IFJ4LlN1YmplY3QoKTtcblxuVXNlckludGVudC5vYnNlcnZlID0gZnVuY3Rpb24ocmVhY3RDb21wb25lbnQpIHtcbiAgICByZWFjdENvbXBvbmVudC5nZXRMb2FkVXNlcnMoKS5zdWJzY3JpYmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIFVzZXJJbnRlbnQuYWN0aW9ucy5vbk5leHQobmV3IEFjdGlvbkV2ZW50KEFwcENvbnN0YW50cy5MT0FELCBudWxsKSk7XG4gICAgfSk7XG4gICAgcmVhY3RDb21wb25lbnQuZ2V0RGVsZXRlVXNlcigpLnN1YnNjcmliZShmdW5jdGlvbihpZCkge1xuICAgICAgICBVc2VySW50ZW50LmFjdGlvbnMub25OZXh0KG5ldyBBY3Rpb25FdmVudChBcHBDb25zdGFudHMuREVMRVRFLCBpZCkpO1xuICAgIH0pO1xuICAgIHJlYWN0Q29tcG9uZW50LmdldENyZWF0ZVVzZXIoKS5zdWJzY3JpYmUoZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBVc2VySW50ZW50LmFjdGlvbnMub25OZXh0KG5ldyBBY3Rpb25FdmVudChBcHBDb25zdGFudHMuQ1JFQVRFLCB7XG4gICAgICAgICAgICBpZDogTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwMDApICsgMTApLFxuICAgICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB9KSk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJJbnRlbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBSeCA9IHJlcXVpcmUoXCJyeC1saXRlXCIpO1xudmFyIEFwcENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9BcHBDb25zdGFudHMuanMnKTtcblxudmFyIFJFU09VUkNFX1VSTCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXJzL1wiO1xuLy8gdmFyIFJFU09VUkNFX1VSTCA9IFwiaHR0cDovL2pzb25wbGFjZWhvbGRlci50eXBpY29kZS5jb20vdXNlcnMvXCI7XG5cbnZhciBVc2Vyc3RvcmUgPSB7fTtcblVzZXJzdG9yZS51cGRhdGVzID0gbmV3IFJ4LlN1YmplY3QoKTtcblxuZnVuY3Rpb24gc2VuZFVwZGF0ZShkYXRhKSB7ICAgIFxuICAgIFVzZXJzdG9yZS51cGRhdGVzLm9uTmV4dChkYXRhKTtcbn1cblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgICAkLmFqYXgoUkVTT1VSQ0VfVVJMKS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBcdHNlbmRVcGRhdGUoZGF0YSk7XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlKHVzZXIpIHtcblx0JC5hamF4KHtcbiAgICAgICAgdXJsOiBSRVNPVVJDRV9VUkwsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodXNlcilcbiAgICB9KS5kb25lKGZ1bmN0aW9uKCkge1xuICAgIFx0bG9hZCgpO1xuICAgIH0pLmZhaWwoZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duICkge1xuICAgIFx0Y29uc29sZS5sb2coZXJyb3JUaHJvd24pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBkZWwodXNlcklkKSB7XG5cdCQuYWpheCh7XG4gICAgICAgIHVybDogUkVTT1VSQ0VfVVJMICsgdXNlcklkLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB0eXBlOiAnREVMRVRFJ1xuICAgIH0pLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgXHRsb2FkKCk7XG4gICAgfSkuZmFpbChmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24gKSB7XG4gICAgXHRjb25zb2xlLmxvZyhlcnJvclRocm93bik7XG4gICAgfSk7XG59XG5cblVzZXJzdG9yZS5vYnNlcnZlID0gZnVuY3Rpb24oaW50ZW50KSB7XG4gICAgaW50ZW50LmFjdGlvbnMuc3Vic2NyaWJlKGZ1bmN0aW9uKGFjdGlvbkV2ZW50KSB7XG4gICAgICAgIHN3aXRjaChhY3Rpb25FdmVudC5hY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLkxPQUQ6XG4gICAgICAgICAgICAgICAgbG9hZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBcHBDb25zdGFudHMuQ1JFQVRFOlxuICAgICAgICAgICAgICAgIGNyZWF0ZShhY3Rpb25FdmVudC5kYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQXBwQ29uc3RhbnRzLkRFTEVURTpcbiAgICAgICAgICAgICAgICBkZWwoYWN0aW9uRXZlbnQuZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgLy8gbm8gb3BcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2Vyc3RvcmU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIEFjdGlvbkV2ZW50KGFjdGlvbiwgZGF0YSkge1xuICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uRXZlbnQ7Il19
