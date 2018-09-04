import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Gameweeks} from '../../api/gameweek.js';
import './gameweekEntry.html';

const gameweekState = new ReactiveVar();
let globalGameweek = 1;

Template.home.onCreated(function bodyOnCreated() {
    let self = this;
    self.subscribe('gameweek');
});

Template.home.onDestroyed(function() {
    gameweekState.set();
});

Template.home.helpers({
    getGameweek() {
        var g = Globals.findOne();

        if (g) {
            var gameweek = gameweekState.get();
            globalGameweek = g.Gameweek;

            return Gameweeks.find({SeasonId: g.SeasonId, Gameweek: (gameweek ? gameweek : globalGameweek)}, 
                {sort: {
                    TotalPoints: -1,
                    DateSet: 1
                }
            });
        }
    }
});

Template.gameweekEntry.helpers({
    showNextGameweekButton() {
        var gameweek = getWeek(this.data) + 1;

        if (gameweek > globalGameweek + 1) {
            return false;
        }

        return true;
    },
    showPreviousGameweekButton() {
        var gameweek = getWeek(this.data) - 1;

        if (gameweek < 1) {
            return false;
        }

        return true;
    },
    getSelectedPlayers(gameweekPlayers) {
        gameweekPlayers.sort(sortPlayers);
        return gameweekPlayers.filter(function(player) {
            return player.Selected;
        });
    },
    getWeek() {
        return getWeek(this.data);
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

const sortPlayers = function(a, b) {
    let aPosition = a.Player.Position;
    let bPosition = b.Player.Position;
  
    let aRecentPoints = a.Player.RecentPoints;
    let bRecentPoints = b.Player.RecentPoints;

    let aTotalPoints = a.Player.TotalPoints;
    let bTotalPoints = b.Player.TotalPoints;
  
    if (aPosition < bPosition) return -1;
    if (aPosition > bPosition) return 1;
    if (aRecentPoints > bRecentPoints) return -1;
    if (aRecentPoints < bRecentPoints) return 1;
    if (aTotalPoints > bTotalPoints) return -1;
    if (aTotalPoints < bTotalPoints) return 1;
};

const getWeek = function(data) {
    if (data) {
        var firstGameweek = data.fetch()[0];
        if (firstGameweek) {
            return firstGameweek.Gameweek;
        }
    }
};

Template.gameweekEntry.events({
    'click .toggleGameweekPlayers'(event) {
        const teamId = event.currentTarget.id;        
        Template.instance().$("." + teamId).toggleClass("hidden");
    },
    'click [nextGameweek]'() {
        var gameweek = getWeek(this.data) + 1;

        if (gameweek > globalGameweek + 1) {
            gameweek = globalGameweek;
        }

        gameweekState.set(gameweek);
    },
    'click [previousGameweek]'() {
        var gameweek = getWeek(this.data) - 1;

        if (gameweek < 1) {
            gameweek = 1;
        }

        gameweekState.set(gameweek);
    }
});