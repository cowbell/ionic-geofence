angular.module("ionic-geofence").config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("geofences", {
            url: "/geofences",
            templateUrl: "views/geofences.html",
            controller: "GeofencesCtrl"
        })
        .state("geofence-new", {
            url: "/geofence/new/:longitude,:latitude",
            templateUrl: "views/geofence.html",
            controller: "GeofenceCtrl",

            resolve: {
                geofence: function ($stateParams, Geofence) {
                    return Geofence.create({
                        longitude: parseFloat($stateParams.longitude),
                        latitude: parseFloat($stateParams.latitude)
                    });
                }
            }
        })
        .state("geofence-edit", {
            url: "geofence/:geofenceId",
            templateUrl: "views/geofence.html",
            controller: "GeofenceCtrl",

            resolve: {
                geofence: function ($stateParams, Geofence, $q) {
                    var geofence = Geofence.findById($stateParams.geofenceId);

                    if (geofence) {
                        return $q.when(angular.copy(geofence));
                    }

                    return $q.reject("Cannot find geofence with id: " + $stateParams.geofenceId);
                }
            }
        });

    $urlRouterProvider.otherwise("/geofences");
});
