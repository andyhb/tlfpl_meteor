FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'home', top: 'navigation'});
    }
});

FlowRouter.route('/admin', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'admin', top: 'navigation'});
    }
});

FlowRouter.route('/players', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'players', top: 'navigation'});
    }
});

FlowRouter.route('/player/:playerId/:seasonId', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'playerInfo', top: 'navigation'});
    }
});

FlowRouter.route('/team/:teamId', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'team', top: 'navigation'});
    }
});

FlowRouter.route('/transfer/:teamId', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'transfer', top: 'navigation'});
    }
});