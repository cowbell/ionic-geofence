angular.module("ionic-geofence").factory("Geofence", function (
    $rootScope,
    $window,
    $q,
    $log,
    $ionicLoading
) {
    var geofenceService = {
        _geofences: [],
        _geofencesPromise: null,

        create: function (attributes) {
            var defaultGeofence = {
                id: UUIDjs.create().toString(),
                latitude: 50,
                longitude: 50,
                radius: 1000,
                transitionType: TransitionType.ENTER,
                notification: {
                    id: this.getNextNotificationId(),
                    title: "Ionic geofence example",
                    text: "",
                    icon: "res://ic_menu_mylocation",
                    openAppOnClick: true
                }
            };

            return angular.extend(defaultGeofence, attributes);
        },

        loadFromLocalStorage: function () {
            var result = localStorage["geofences"];
            var geofences = [];

            if (result) {
                try {
                    geofences = angular.fromJson(result);
                } catch (ex) {

                }
            }
            this._geofences = geofences;

            return $q.when(this._geofences);
        },

        saveToLocalStorage: function () {
            localStorage["geofences"] = angular.toJson(this._geofences);
        },

        loadFromDevice: function () {
            var self = this;

            if ($window.geofence && $window.geofence.getWatched) {
                return $window.geofence.getWatched().then(function (geofencesJson) {
                    self._geofences = angular.fromJson(geofencesJson);
                    return self._geofences;
                });
            }

            return this.loadFromLocalStorage();
        },

        getAll: function () {
            var self = this;

            if (!self._geofencesPromise) {
                self._geofencesPromise = $q.defer();
                self.loadFromDevice().then(function (geofences) {
                    self._geofences = geofences;
                    self._geofencesPromise.resolve(geofences);
                }, function (reason) {
                    $log.error("Error fetching geofences", reason);
                    self._geofencesPromise.reject(reason);
                });
            }

            return self._geofencesPromise.promise;
        },

        addOrUpdate: function (geofence) {
            var self = this;

            return $window.geofence.addOrUpdate(geofence).then(function () {
                var searched = self.findById(geofence.id);

                if (!searched) {
                    self._geofences.push(geofence);
                } else {
                    var index = self._geofences.indexOf(searched);

                    self._geofences[index] = geofence;
                }

                self.saveToLocalStorage();
            });
        },

        findById: function (id) {
            var geoFences = this._geofences.filter(function (g) {
                return g.id === id;
            });

            if (geoFences.length > 0) {
                return geoFences[0];
            }

            return undefined;
        },

        remove: function (geofence) {
            var self = this;

            $ionicLoading.show({
                template: "Removing geofence..."
            });
            $window.geofence.remove(geofence.id).then(function () {
                $ionicLoading.hide();
                self._geofences.splice(self._geofences.indexOf(geofence), 1);
                self.saveToLocalStorage();
            }, function (reason) {
                $log.error("Error while removing geofence", reason);
                $ionicLoading.show({
                    template: "Error while removing geofence",
                    duration: 1500
                });
            });
        },

        removeAll: function () {
            var self = this;

            $ionicLoading.show({
                template: "Removing all geofences..."
            });
            $window.geofence.removeAll().then(function () {
                $ionicLoading.hide();
                self._geofences.length = 0;
                self.saveToLocalStorage();
            }, function (reason) {
                $log.error("Error while removing all geofences", reason);
                $ionicLoading.show({
                    template: "Error",
                    duration: 1500
                });
            });
        },

        getNextNotificationId: function () {
            var max = 0;

            this._geofences.forEach(function (gf) {
                if (gf.notification && gf.notification.id) {
                    if (gf.notification.id > max) {
                        max = gf.notification.id;
                    }
                }
            });

            return max + 1;
        }
    };

    return geofenceService;
});
