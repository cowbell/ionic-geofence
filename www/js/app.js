// Ionic Geofence example App

angular.module('ionic-geofence', ['ionic', 'leaflet-directive'])
    .config(function ($stateProvider, $urlRouterProvider) {
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
    })
    .run(function ($window, $document, $ionicLoading, $state, $ionicPlatform, $log, $rootScope) {
        $ionicPlatform.ready(function () {
            $log.log('Ionic ready');
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if ($window.cordova && $window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if ($window.StatusBar) {
                $window.StatusBar.styleDefault();
            }
            if ($window.geofence) {
                $window.geofence.onTransitionReceived = function (geofences) {
                    $log.log(geofences);
                    if (geofences) {
                        $rootScope.$apply(function () {
                            geofences.forEach(function (geo) {
                                geo.notification = geo.notification || {
                                    title: 'Geofence transition',
                                    text: 'Without notification'
                                };
                                $ionicLoading.show({
                                    template: geo.notification.title + ': ' + geo.notification.text,
                                    noBackdrop: true,
                                    duration: 2000
                                });
                            });
                        });
                    }
                };

                $window.geofence.onNotificationClicked = function (notificationData) {
                    $log.log(notificationData);
                    if (notificationData) {
                        $rootScope.$apply(function () {
                            $ionicLoading.show({
                                template: 'Notification clicked: ' + notificationData.notification.text,
                                noBackdrop: true,
                                duration: 2000
                            });
                        });
                    }
                };

                $window.geofence.initialize();
            }
            if ($window.plugins && $window.plugins.webintent) {
                $log.log('WebIntent plugin found');
                $window.plugins.webintent.getExtra('geofence.notification.data',
                    function (geofenceJson) {
                        if (geofenceJson) {
                            var geofence = angular.fromJson(geofenceJson);
                            $log.log('geofence.notification.data', geofence);
                            $state.go('geofence', {
                                geofenceId: geofence.id
                            });
                        }
                    },
                    function () {
                        $log.log('no extra geofence.notification.data supplied');
                        // There was no extra supplied.
                    }
                );
            }
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $log.log('stateChangeError ', error, toState, toParams, fromState, fromParams);
            $state.go('geofences');
        });
    });
