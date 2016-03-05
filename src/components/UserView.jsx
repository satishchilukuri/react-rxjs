"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var Rx = require("rx-lite");

var loadUsers = new Rx.Subject();
var deleteUser = new Rx.Subject();
var createUser = new Rx.Subject();

var UserView = React.createClass({
    statics: {
        getLoadUsers: function() {
            return loadUsers;
        },
        getDeleteUser: function() {
            return deleteUser;
        },
        getCreateUser: function() {
            return createUser;
        }
    },
    getInitialState: function() {
        return {users: []};
    },
    updates: null,
    componentDidMount: function() {        
        this.updates = this.props.store.updates.subscribe(function(data) {
            this.setState({users: data});
        }.bind(this));
        loadUsers.onNext();
    },
    componentWillUnmount: function() {
        this.updates.dispose();
    },
    deleteUser: function(id, e) {
        e.preventDefault();
        deleteUser.onNext(id);
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var firstName = ReactDOM.findDOMNode(this.refs.firstName).value;
        var lastName = ReactDOM.findDOMNode(this.refs.lastName).value;

        if (firstName === "" || lastName === "") {
            alert("First and last name are required");
            return;
        }
        createUser.onNext(firstName + " " + lastName);
        
    },
    render: function() {
        
        var users = [];
        if(this.state.users) {
            this.state.users.forEach(function (user, i) {
                users.push(
                    <tr key={i}>
                        <td>{user.name}</td>
                        <td><input type="button" className="btn btn-default btn-sm" value="Delete" onClick={this.deleteUser.bind(null, user.id)}/></td>
                    </tr>
                );
            }.bind(this))
        }

        return (
            <div>
                {/* Header */}
                <nav className="navbar navbar-default">
                    <div className="container-fluid">                    
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">Model-View-Intent with React-RxJS</a>
                        </div>{/*/.navbar-header */}
                    </div>{/*/.container-fluid */}
                </nav>

                {/* User List */}
                <div className="panel panel-default">
                    <div className="panel-heading">Users</div>              

                    <table className="table">
                        <thead>
                        <tr>
                            <th className="col-md-3">User name</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users}
                        </tbody>
                    </table>
                </div>

                {/* Form for creating new user */}
                <div className="row">
                    <div className="col-md-4">
                        <h3>Create new user</h3>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="firstName">First name:</label>
                                <input type="text" className="form-control" maxLength="128" ref="firstName" id="firstName"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last name:</label>
                                <input type="text" className="form-control" maxLength="128" ref="lastName" id="lastName"/>
                            </div>
                            <div className="form-group">
                                <input type="submit" className="btn btn-default" value="Submit"/>
                            </div>
                        </form>
                    </div>
                </div>


            </div>
        );
    }
})

module.exports = UserView;