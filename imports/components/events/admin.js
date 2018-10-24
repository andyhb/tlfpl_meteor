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

    let self = this;
    self.subscribe("league_events");
});

Template.eventAdmin.onDestroyed(function() {
    self.stop();
});

Template.eventAdmin.helpers({
    getDefaultDateTimeValue() {
        return "2018-10-01T12:00";
    },
    events() {
        return Events.find({}, {
            sort: {
                Date: 1
            }
        });
    }
});

Template.eventAdminEntry.helpers({
    showOnHomePage() {
        return this.ShowOnHomePage;
    }
});

Template.eventAdmin.events({
    'submit .new-event'(event) {
        event.preventDefault();
    
        const target = event.target;
        const title = target.title.value;
        const date = new Date(target.date.value);
        const type = target.type.value;
    
        Meteor.call('events.insert', title, date, type);
    
        target.title.value = '';
        target.date.value = '';
        target.type.value = '';
    }
});

Template.eventAdminEntry.events({
    'click .delete'() {
        Meteor.call('events.remove', this._id);
    },
    'click .toggle-showOnHomePage'() {
        Meteor.call('events.setShowOnHomePage', this._id, !this.ShowOnHomePage);
    }
});