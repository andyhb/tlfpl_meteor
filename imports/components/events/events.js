import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Events} from '../../api/events.js';
import './events.html';

Template.events.onCreated(function bodyOnCreated() {
    Meteor.subscribe("league_events_upcoming");
});

Template.events.helpers({
    events() {
        return Events.find({}, {
            sort: {
                Date: 1
            }
        });
    }
});

Template.eventEntry.helpers({
    formatDate(date) {
        if (date) {
            return formatDate(date);
        }
    },
    getType() {
        if (this.Type && this.Type === 'match') {
            return "fas fa-futbol";
        }

        return "far fa-calendar-alt";
    }
});