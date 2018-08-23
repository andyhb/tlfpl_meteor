import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './users.html';  
import '../../api/users.js';

Template.admin.onCreated(function bodyOnCreated() {
  const currentUser = Meteor.user();

  if (!currentUser) {
    FlowRouter.go("/");
  }

  if (currentUser && (!currentUser.role || currentUser.role !== 'admin')) {
    FlowRouter.go("/");
  }

  Meteor.subscribe('users');
});

Template.admin.helpers({
  users() {
    return Meteor.users.find();
  }
});

Template.user.helpers({
  getEmail() {
    return this.emails[0].address;
  }
});

Template.admin.events({
  'submit .new-user'(event) {
    event.preventDefault();

    const target = event.target;
    const email = target.email.value;
    const password = target.password.value;

    Meteor.call('users.insert', email, password);

    target.email.value = '';
    target.password.value = '';
  }
});

Template.user.events({
  'submit .edit-user'(event) {
    event.preventDefault();

    const target = event.target;
    const name = target.name.value;

    Meteor.call('users.update', this._id, name);

    target.name.value = '';
  },
  'click .delete'() {
    Meteor.call('users.remove', this._id);
  }
});