angular.module('ionic-geofence').config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('geofences', {
            url: '/geofences',
            templateUrl: 'views/geofences.html',
            controller: 'GeofencesCtrl'
        })
        .state('geofence', {
            url: '/geofence/:geofenceId',
            templateUrl: 'views/geofence.html',
            controller: 'GeofenceCtrl',
            resolve: {
                geofence: function ($stateParams, geofenceService, $q) {
                    var geofence = geofenceService.findById($stateParams.geofenceId);
                    if (geofence) {
                        return $q.when(geofence);
                    }
                    return $q.reject('Cannot find geofence with id: ' + $stateParams.geofenceId);
                }
            }
        });

    $urlRouterProvider.otherwise('/geofences');
});
