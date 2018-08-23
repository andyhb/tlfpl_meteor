import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Gameweeks} from '../../api/gameweek.js';
import './gameweekEntry.html';

Template.home.onCreated(function bodyOnCreated() {
    Meteor.subscribe('gameweek');
});

Template.home.helpers({
    getGameweek(modifier) {
        var g = Globals.findOne();

        if (g) {
            let gameweek = g.Gameweek;
            
            if (modifier === "next") {
                gameweek++;
            } else if (modifier === "previous") {
                gameweek--;
            }

            return Gameweeks.find({SeasonId: g.SeasonId, Gameweek: gameweek}, 
                {sort: {
                    TotalPoints: -1,
                    DateSet: 1
                }
            });
        }
    }
});

Template.gameweekEntry.helpers({
    getSelectedPlayers(gameweekPlayers) {
        return gameweekPlayers.filter(function(player) {
            return player.Selected;
        });
    },
    getWeek() {
        if (this.data) {
            var firstGameweek = this.data.fetch()[0];
            if (firstGameweek) {
                return firstGameweek.Gameweek;
            }
        }
    },
    formatDate(date) {
        if (date) {
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

            return (hours + ":" + minutes + " " + day + "-" + month + "-" + d.getFullYear());
        }
    }
});

Template.gameweekEntry.events({
    'click .toggleGameweekPlayers'(event) {
        const teamId = event.currentTarget.id;        
        Template.instance().$("." + teamId).toggleClass("hidden");
    }
});