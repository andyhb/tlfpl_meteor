FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'home', top: 'navigation'});
    }
});

FlowRouter.route('/profile', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'profile', top: 'navigation'});
    }
});

FlowRouter.route('/admin', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'admin', top: 'navigation'});
    }
});

FlowRouter.route('/cup/fixtures', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'fixtures', top: 'navigation'});
    }
});

FlowRouter.route('/cup/admin', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'cupAdmin', top: 'navigation'});
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

FlowRouter.route('/team/compare/:teamId/:teamToCompareId', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'compareTeams', top: 'navigation'});
    }
});

FlowRouter.route('/transfer/:teamId', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'transfer', top: 'navigation'});
    }
});

FlowRouter.route('/chart', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'chart', top: 'navigation'});
    }
});

FlowRouter.route('/halloffame', {
    action: function() {
        BlazeLayout.render('app_body', {main: 'hallOfFame', top: 'navigation'});
    }
});

FlowRouter.triggers.exit([ensureNavCollapsed]);

function ensureNavCollapsed() {
    if ($('.navbar-collapse').attr('aria-expanded')) {
        $('.navbar-toggle').click();
    }
};