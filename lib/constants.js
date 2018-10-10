import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Globals = new Mongo.Collection('globals');

if (Meteor.isServer) {
    Meteor.publish(null, function globalsPublication() {
        return Globals.find();    
    });
}

formatDate = function(date) {
    var d = new Date(date);
    var hours = d.getHours() + "";
    var minutes = d.getMinutes() + "";
    var day = d.getDate() + "";
    var month = (d.getMonth() + 1) + "";

    if (hours.length == 1) {
        hours = "0" + hours;
    }

    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }

    if (day.length == 1) {
        day = "0" + day;
    }

    if (month.length == 1) {
        month = "0" + month;
    }

    return (hours + ":" + minutes + " on " + day + "-" + month + "-" + d.getFullYear());
}