import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Events} from '../../api/events.js';
import './admin.html';

Template.eventAdmin.onCreated(function bodyOnCreated() {
    const currentUser = Meteor.user();

    if (!currentUser) {
        FlowRouter.go("/");
    }

    if (currentUser && (!currentUser.role || currentUser.role.indexOf('admin') < 0)) {
        FlowRouter.go("/");
    }

    Meteor.subscribe("league_events");
});

Template.eventAdmin.helpers({
    events() {
        return Events.find({}, {
            sort: {
                Date: 1
            }
        });
    }
});

Template.eventAdmin.events({
    'submit .new-event'(event) {
        event.preventDefault();
    
        const target = event.target;
        const title = target.title.value;
        const date = new Date(target.date.value);
    
        Meteor.call('events.insert', title, date);
    
        target.title.value = '';
        target.date.value = '';
    }
});

Template.eventAdminEntry.events({
    'click .delete'() {
        Meteor.call('events.remove', this._id);
    }
});