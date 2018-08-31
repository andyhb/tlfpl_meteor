import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Players} from '../../api/players.js';
import './playerInfo.html';

Template.playerInfo.onCreated(function bodyOnCreated() {
    Meteor.subscribe('playerInfo', FlowRouter.getParam('playerId') + "/" + FlowRouter.getParam('seasonId'));
});

Template.playerInfo.helpers({
    playerInfo() {
        return Players.findOne();
    },
    showWebName() {
        return this.Surname !== this.WebName;
    },
    getInfoIconType() {
        return getInfoIconType(this.ChanceOfPlayingPercentage);
    },
    getNews() {
        if (this.News === "") {
            return "Player available for selection";
        } else {
            return this.News;
        }
    },
    getAlertClass() {
        let iconType = getInfoIconType(this.ChanceOfPlayingPercentage);

        if (iconType === "check") {
            return "success";
        }

        if (iconType == "exclamation") {
            return "warning";
        }

        return "danger";
    },
    getFixture(fixture) {
        return (fixture.Home ?
             "<b>" + this.TeamName + "</b> v " + fixture.Opponent : 
             fixture.Opponent + " v <b>" + this.TeamName + "</b>");
    },
    getGameweek(next) {
        let g = Globals.findOne();

        if (g) {
            return (next ? g.Gameweek + 1 : g.Gameweek);
        }
    }
});

const getInfoIconType = function(chance) {
    if (chance < 0 || chance === 100) {
        return "check";
    }

    if (chance === 0) {
        return "exclamation-triangle";
    }
    
    return "exclamation";
};