import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';

import {Table} from '../../api/table.js';
import {Teams} from '../../api/teams.js';
import './chart.html';

const pinkMode = new ReactiveVar(true);
const onlyOwn = new ReactiveVar(false);
const showPoints = new ReactiveVar(false);
const currentUserTeam = new ReactiveVar();

Template.chart.onCreated(function bodyOnCreated() {
    Meteor.subscribe("table");
    Meteor.subscribe('currentUserTeamId');

    this.autorun(() => {
        const team = Teams.findOne();

        if (team) {
            currentUserTeam.set(team);
        }
    });
});

Template.chart.onRendered(function () {
    this.autorun(() => {
        let gameweeks = [];
        let tableDatasets = [];
        let options = {
            scales: {
                yAxes: [{
                    ticks: {
                        reverse: true,
                        min: 1,
                        max: 10,
                        stepsize: 1
                    }
                }]
            }
        };

        if (showPoints.get()) {
            options = {};
        }

        Table.find({}).forEach(function(table) {
            gameweeks.push(table.Gameweek);

            table.Standings.forEach(function(teamStanding) {
                let teamData = tableDatasets.filter(tds => tds.label === teamStanding.TeamName)[0];

                if (teamData) {
                    teamData.data.push(showPoints.get() ? teamStanding.TotalPoints : teamStanding.Position);
                } else {
                    teamData = {};
                    teamData.label = teamStanding.TeamName;
                    if (pinkMode.get()) {
                        teamData.borderColor = 'rgb(255,99,132)';
                    } else {
                        if (teamStanding.TeamName === "Rich's Belly Floppers") {
                            teamData.borderColor = 'rgb(151,245,245)';
                        } else if (teamStanding.TeamName === "Cotton Pickers") {
                            teamData.borderColor = 'rgb(176,128,64)';
                        } else if (teamStanding.TeamName === "TBA FC") {
                            teamData.borderColor = 'rgb(227,37,107)';
                        } else if (teamStanding.TeamName === "Dyslexia Untied" || "Victor Moses Lawn") {
                            teamData.borderColor = 'rgb(40,106,77)';
                        } else if (teamStanding.TeamName === "FC Quichetopol") {
                            teamData.borderColor = 'rgb(236,213,64)';
                        } else if (teamStanding.TeamName === "Bangkok Young Boys") {
                            teamData.borderColor = 'rgb(183,132,167)';
                        } else if (teamStanding.TeamName === "Lads On Toure") {
                            teamData.borderColor = 'rgb(255,0,0)';
                            teamData.borderDash = [5,5];
                        } else if (teamStanding.TeamName === "Pinky's U-11s") {
                            teamData.borderColor = 'rgb(50,50,255)';
                        } else if (teamStanding.TeamName === "BJ Falls FC") {
                            teamData.borderColor = 'rgb(110,238,110)';
                        } else {
                            teamData.borderColor = 'rgb(255,99,132)';
                        }
                        teamData.backgroundColor = teamData.borderColor;
                        teamData.fill = false;
                    }

                    teamData.data = [showPoints.get() ? teamStanding.TotalPoints : teamStanding.Position];

                    if (onlyOwn.get() && currentUserTeam.get()) {
                        if (currentUserTeam.get()._id !== teamStanding.TeamId) {
                            teamData.hidden = true;
                        }
                    }

                    tableDatasets.push(teamData);
                }
            });
        });
        
        var ctx = document.getElementById('myChart');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: gameweeks,
                datasets: tableDatasets
            },
            options: options
        });
    });
});

Template.chart.events({
    'click #customColours'() {
        pinkMode.set(!pinkMode.get());
    },
    'click #onlyOwn'() {
        onlyOwn.set(!onlyOwn.get());
    },
    'click #showPoints'() {
        showPoints.set(!showPoints.get());
    }
});