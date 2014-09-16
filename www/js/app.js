// Ionic Geofence example App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionic-geofence', ['ionic', 'leaflet-directive'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('geofences', {
                url: "/geofences",
                templateUrl: "views/geofences.html",
                controller: "GeofencesCtrl"
            })
            .state('geofence', {
                url: "/geofence/:geofenceId",
                templateUrl: "views/geofence.html",
                controller: "GeofenceCtrl",
                resolve: {
                    geofence: function($stateParams, geofenceService, $q) {
                        var def = $q.defer();
                        var gf = geofenceService.findById($stateParams.geofenceId);
                        if(gf){
                            def.resolve(gf);
                        }
                        else{
                            def.reject();
                        }
                        return def.promise;
                    }
                }
            });

        $urlRouterProvider.otherwise('/geofences');
    })
    .run(function($window, $state, $ionicPlatform, $log, $rootScope) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if ($window.cordova && $window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if ($window.StatusBar) {
                StatusBar.styleDefault();
            }
            if ($window.plugins && $window.plugins.webintent) {
                $window.plugins.webintent.getExtra("geofence.notification.data",
                    function(geofenceJson) {
                        if (geofenceJson) {
                            var geofence = angular.fromJson(geofenceJson);
                            $log.log('geofence.notification.data', geofence);
                            $state.go('geofence', {
                                geofenceId: geofence.id
                            });
                        }
                    }, function() {
                        $log.log('no extra geofence.notification.data supplied');
                        // There was no extra supplied.
                    }
                );
            }
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $log.log('stateChangeError ', error, toState, toParams, fromState, fromParams);
            $state.go('geofences');
        });
    })
