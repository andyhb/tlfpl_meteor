import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './login.html';  

const showLoginForm = new ReactiveVar(false);

Template.login.helpers({
    showLoginForm() {
        return showLoginForm.get();
    }
});

Template.login.events({
    'click #showLoginForm' (event) {
        event.preventDefault();
        showLoginForm.set(!showLoginForm.get());
    },
    'submit #login' (event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar);
        showLoginForm.set(!showLoginForm.get());
    },
    'click #cancelLogin' () {
        showLoginForm.set(!showLoginForm.get());
    }
});