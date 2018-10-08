import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {CupGroupFixtures, CupGroupTables} from '../../api/cup.js';
import './fixtures.html';
import './cupGroupTable.html';
import './cupGroupTableEntry.html';

Template.fixtures.onCreated(function bodyOnCreated() {
    Meteor.subscribe("cup_group_fixtures");
    Meteor.subscribe("cup_group_tables");
});

Template.fixtures.helpers({
    cupFixtures() {
        return CupGroupFixtures.find();
    },
    notBye(match) {
        return !match.Team1.Bye && !match.Team2.Bye;
    },
    getCupTableData(id) {
        var g = Globals.findOne();

        if (g) {
            var gameweek = gameweekState.get();
            globalGameweek = g.Gameweek;

            return CupGroupTables.findOne({
                _id: (gameweek ? gameweek : globalGameweek) + "/" + g.SeasonId + "/" + id
            });
        }
    },
    isGreater(fixture, team1) {
        if (team1) {
            if (fixture.Team1.Points > fixture.Team2.Points) {
                return "isGreater";
            }
        } else {
            if (fixture.Team2.Points > fixture.Team1.Points) {
                return "isGreater";
            }
        }
    },
    showPoints(points) {
        if (points) {
            return points;
        } else {
            return "";
        }
    }
});

const gameweekState = new ReactiveVar();
let globalGameweek = 1;

Template.cupGroupTable.onCreated(function bodyOnCreated() {
    Meteor.subscribe("cup_group_tables");
});

Template.cupGroupTable.helpers({
    getGameweek() {
        if (this.data) {
            return this.data.Gameweek;
        }
    },
    showNextGameweekButton() {
        if (this.data) {
            var gameweek = this.data.Gameweek + this.skipWeek;

            if (gameweek > globalGameweek) {
                return false;
            }

            return true;
        }
    },
    showPreviousGameweekButton() {
        if (this.data) {
            var gameweek = this.data.Gameweek - this.skipWeek;

            if (gameweek < this.startingWeek) {
                return false;
            }

            return true;
        }
    }
});

Template.cupGroupTable.events({
    'click [nextGameweek]'() {
      var gameweek = this.data.Gameweek + this.skipWeek;
  
      if (gameweek > globalGameweek) {
        gameweek = globalGameweek;
      }
  
      gameweekState.set(gameweek);
    },
    'click [previousGameweek]'() {
      var gameweek = this.data.Gameweek - this.skipWeek;
  
      if (gameweek < this.startingWeek) {
        gameweek = this.startingWeek;
      }
  
      gameweekState.set(gameweek);
    }
});

Template.cupGroupTableEntry.helpers({
    movedUp(position, previousPosition) {
        if (!previousPosition) {
            return false;
        }

        if (position < previousPosition) {
            return true;
        }

        return false;
    },
    movedDown(position, previousPosition) {
        if (!previousPosition) {
            return false;
        }

        if (position > previousPosition) {
            return true;
        }

        return false;
    },
    getPlayed() {
        return this.Win + this.Lose + this.Draw;
    }
});