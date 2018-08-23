import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import {Tasks} from '../../api/tasks.js';
import './todosList.html';

Template.home.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.home.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      return Tasks.find(
        { checked: { $ne: true } }, 
        { sort: { createdAt: -1 } 
      });
    }

    return Tasks.find(
      {}, 
      { sort: { createdAt: -1 }
    });
  },
  incompleteCount() {
    return Tasks.find({
      checked: {
        $ne: true
      }
    }).count();
  },
  currentUser() {
    return Meteor.user();
  }
});

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  }
});

Template.home.events({
  'submit .new-task'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;

    Meteor.call('tasks.insert', text);

    target.text.value = '';
  },
  'change .hide-completed'(event, template) {
    template.state.set('hideCompleted', event.target.checked);
  },
});

Template.task.events({
  'click .toggle-checked'() {
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  }
});