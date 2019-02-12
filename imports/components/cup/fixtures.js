import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {CupGroupFixtures, CupGroupTables, CupKnockoutFixtures} from '../../api/cup.js';
import './fixtures.html';
import './cupGroupTable.html';
import './cupGroupTableEntry.html';

Template.fixtures.onCreated(function bodyOnCreated() {
    Meteor.subscribe("cup_group_fixtures");
    Meteor.subscribe("cup_group_tables");
    Meteor.subscribe("cup_knockout_fixtures");
});

Template.fixtures.helpers({
    cupGroupFixtures() {
        return CupGroupFixtures.find();
    },
    cupKnockoutFixtures() {
        return CupKnockoutFixtures.find();
    },
    notBye(match) {
        return !match.Team1.Bye && !match.Team2.Bye;
    },
    getCupTableData(id) {
        var g = Globals.findOne();

        if (g) {
            const selector = {};
            var gameweek = gameweekState.get();
            globalGameweek = g.Gameweek;

            selector.SeasonId = g.SeasonId;
            selector.CupGroupId = id;

            var tables = CupGroupTables.find(selector).fetch();

            if (tables) {
                var gw = (gameweek ? gameweek : globalGameweek);
                var selectedTable = tables.filter(table => table.Gameweek === gw)[0];

                if (!selectedTable) {
                    gw = ((gameweek ? gameweek : globalGameweek) - 1);
                    selectedTable = tables.filter(table => table.Gameweek === gw)[0];
                }

                if (selectedTable) {
                    return selectedTable;
                }
            }
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