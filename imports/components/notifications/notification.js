import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './notification.html';

Template.notification.helpers({
    showNotification() {
        return true;
    },
    getNotificationType() {
        return "alert-success";
    },
    notificationMessage() {
        return "TITS";
    }
});