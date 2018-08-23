import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import {Seasons} from '../../api/seasons.js';
import './seasons.html';

Template.admin.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('seasons');
});

Template.admin.helpers({
  seasons() {
    const instance = Template.instance();

    return Seasons.find({}, {
      sort: {
        name: 1
      }
    });
  }
});

Template.admin.events({
  'submit .new-season'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;

    Meteor.call('seasons.insert', text);
  
    target.text.value = '';
  },
});

Template.season.events({
  'click .toggle-current'() {
    Meteor.call('seasons.current', this._id);
  },
  'click .delete'() {
    Meteor.call('seasons.remove', this._id);
  }
});