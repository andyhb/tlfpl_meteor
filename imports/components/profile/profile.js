import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base'

import './profile.html';

const showAlert = new ReactiveVar(false);
const alertMessage = new ReactiveVar();
const alertLevel = new ReactiveVar();

Template.profile.onCreated(function bodyOnCreated() {
    Meteor.subscribe('userData');
});

Template.profile.onDestroyed(function () {
    showAlert.set(false);
});

Template.profile.helpers({
    profile() {
        return Meteor.user();
    },
    showAlert() {
        return showAlert.get();
    },
    alertLevel() {
        return alertLevel.get();
    },
    alertMessage() {
        return alertMessage.get();
    }
});

Template.profile.events({
    'submit #changePassword' (event) {
        event.preventDefault();
        let oldPassword = event.target.oldPassword.value;
        let newPassword = event.target.newPassword.value;
        let confirmNewPassword = event.target.confirmNewPassword.value;

        if (!oldPassword || !newPassword || !confirmNewPassword || (newPassword !== confirmNewPassword)) {
            showAlert.set(true);
            alertLevel.set("danger");
            alertMessage.set("Failed to change password. Do it properly please");
            return;
        }

        Accounts.changePassword(oldPassword, newPassword, function(error) {
            showAlert.set(true);
            if (error) {
                alertLevel.set("danger");
                alertMessage.set("Failed to change password. You probably goofed something");
            } else {
                alertLevel.set("success");
                alertMessage.set("Password changed successfully")
            }
        });
    },
    'click .close' () {
        showAlert.set(false);
    }
});