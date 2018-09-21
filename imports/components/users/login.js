import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './login.html';  

const showLoginForm = new ReactiveVar(false);
const showForgotPasswordForm = new ReactiveVar(false);
const loginError = new ReactiveVar();

Template.login.helpers({
    showForm() {
        return showLoginForm.get() || showForgotPasswordForm.get()
    },
    showLoginForm() {
        return showLoginForm.get();
    },
    getLoginError() {
        return loginError.get();
    },
    getLoginClass() {
        return loginError.get() ? "text-danger" : "";
    },
    showForgotPasswordForm() {
        return showForgotPasswordForm.get();
    }
});

Template.login.events({
    'click #showLoginForm' (event) {
        event.preventDefault();
        showLoginForm.set(!showLoginForm.get());
        loginError.set();
    },
    'submit #login' (event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        
        Meteor.loginWithPassword(emailVar, passwordVar, function(error) {
            if (error) {
                loginError.set(error.reason);
            }
        });

        showLoginForm.set(!showLoginForm.get());
    },
    'click #cancelLogin' () {
        showLoginForm.set(!showLoginForm.get());
        loginError.set();
    },
    'click .close' () {
        loginError.set();
    },
    'click #forgotPassword' () {
        showLoginForm.set(!showLoginForm.get());
        showForgotPasswordForm.set(!showForgotPasswordForm.get());
    },
    'submit #forgotPasswordForm' (event) {
        event.preventDefault();
        var emailVar = event.target.forgotPasswordEmail.value;
        
        Accounts.forgotPassword({email: emailVar}, function(error) {
            if (error) {
                loginError.set(error.reason);
            }
        });

        showLoginForm.set(!showLoginForm.get());
        showForgotPasswordForm.set(!showForgotPasswordForm.get());
    },
    'click #cancelForgotPassword' () {
        showLoginForm.set(!showLoginForm.get());
        showForgotPasswordForm.set(!showForgotPasswordForm.get());
    }
});