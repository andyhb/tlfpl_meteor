import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {HallOfFame} from '../../api/hallOfFame.js';
import './hallOfFame.html';

Template.hallOfFame.onCreated(function bodyOnCreated () {
    Meteor.subscribe("halloffame");
});

Template.hallOfFame.helpers({
    getLeagueResults() {
        let hallOfFame = HallOfFame.findOne();

        if (hallOfFame) {
            return hallOfFame.LeagueResults.sort(sortLeagueResults);
        }
    },
    getPosition(index) {
        return index + 1;
    },
    getCupResults() {
        let hallOfFame = HallOfFame.findOne();

        if (hallOfFame) {
            return hallOfFame.CupResults.sort(sortCupResults);
        }
    },
    getTrophies(count)  {
        return Array.from(Array(count));
    }
});

const sortLeagueResults = function(a, b) {
    let aTotalPoints = a.TotalPoints;
    let bTotalPoints = b.TotalPoints;

    let aHOFPoints = a.HallOfFamePoints;
    let bHOFPoints = b.HallOfFamePoints;

    if (aHOFPoints > bHOFPoints) return -1;
    if (aHOFPoints < bHOFPoints) return 1;
    if (aTotalPoints < bTotalPoints) return 1;
    if (aTotalPoints > bTotalPoints) return -1;
};

const sortCupResults = function(a, b) {
    let aWins = a.CupWinner;
    let bWins = b.CupWinner;

    let aRunnerUp = a.CupRunnerUp;
    let bRunnerUp = b.CupRunnerUp;

    let aName = a.ManagerName;
    let bName = b.ManagerName;

    if (aWins > bWins) return -1;
    if (aWins < bWins) return 1;
    if (aRunnerUp > bRunnerUp) return -1;
    if (aRunnerUp < bRunnerUp) return 1;
    if (aName > bName) return 1;
    if (aName < bName) return -1;
};