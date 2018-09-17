import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import {Teams} from '../../api/teams.js';

import './compareTeams.html';

Template.compareTeams.onRendered(function() {
    const mySwiper = new Swiper('.swiper-container', {
        initialSlide: 1,
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        }
    });
});

Template.compareTeamsSplit.onCreated(function bodyOnCreated() {
    Meteor.subscribe('teamInfo', FlowRouter.getParam('teamId'));
    Meteor.subscribe('teamInfo', FlowRouter.getParam('teamToCompareId'));
});

const getCombinedPlayersForPosition = function(position, players) {
    let combinedPlayersForPosition = [];
    let maxCount = 0;
    let playersInPositionForTeam = []
    let playerPosition = getPosition(position);

    for (let team = 0; team < 2; team++) {
        let tempPlayersInPositionForTeam = players[team].filter(player => player.Position === position).sort(sortPlayers);
        if (tempPlayersInPositionForTeam.length > maxCount) {
            maxCount = tempPlayersInPositionForTeam.length;
        }
        playersInPositionForTeam[team] = tempPlayersInPositionForTeam;
    }

    for (let x = 0; x < maxCount; x++) {
        let combinedPlayer = {};
        for (let team = 0; team < 2; team++) {
            let player = playersInPositionForTeam[team][x];

            if (player) {
                combinedPlayer.Position = playerPosition;
                combinedPlayer["Team" + (team + 1) + "PlayerTotalPoints"] = player.TotalPoints;
                combinedPlayer["Team" + (team + 1) + "PlayerName"] = player.WebName;
            }
        }

        combinedPlayersForPosition.push(combinedPlayer);
    }

    return combinedPlayersForPosition;
};

Template.compareTeamsSplit.helpers({
    getCombinedPlayerList() {
        let combinedPlayers = [];

        let team1 = Teams.findOne({_id: FlowRouter.getParam('teamId')});
        let team2 = Teams.findOne({_id: FlowRouter.getParam('teamToCompareId')});

        if (team1 && team2) {
            let players = [];
            players.push(team1.Players.filter(player => player.Current).map(player => player.Player));
            players.push(team2.Players.filter(player => player.Current).map(player => player.Player));

            for (let position = 1; position < 5; position++) {
                let playersForPosition = getCombinedPlayersForPosition(position, players);
                playersForPosition.forEach(player => combinedPlayers.push(player));
            }

            return combinedPlayers;
        }
    },
    isGreater(p1Total, p2Total) {
        if (p1Total && !p2Total) {
            return "isGreater";
        }

        if (p1Total > p2Total) {
            return "isGreater";
        }
        
        return "";
    }
});

const getPosition = function(position) {
    if (position === 1) {
      return "GK";
    }
  
    if (position === 2) {
      return "DEF";
    }
  
    if (position === 3) {
      return "MID";
    }
  
    if (position === 4) {
      return "FOR";
    }
  };

  const sortPlayers = function(a, b) {  
    let aRecentPoints = a.RecentPoints;
    let bRecentPoints = b.RecentPoints;

    let aTotalPoints = a.TotalPoints;
    let bTotalPoints = b.TotalPoints;
    
    if (aTotalPoints > bTotalPoints) return -1;
    if (aTotalPoints < bTotalPoints) return 1;
    if (aRecentPoints > bRecentPoints) return -1;
    if (aRecentPoints < bRecentPoints) return 1;
};