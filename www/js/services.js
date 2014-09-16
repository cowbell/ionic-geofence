angular.module('ionic-geofence')
    .factory('geofenceService', function($window, $log) {
        
        $window.geofence = $window.geofence || {
            addOrUpdate: function(fences) {
                $log.log('Mocked geofence plugin addOrUpdate', fences);
            },
            remove: function(ids) {
            	$log.log('Mocked geofence plugin remove', ids);
            },
            removeAll: function(){
            	$log.log('Mocked geofence plugin removeAll');
            }
        };

        var geofenceService = {
            _geofences: [],
            createdGeofenceDraft: null,
            loadFromLocalStorage: function(){
            	var result = localStorage['geofences'];
		        var geofences = [];
		        if (result) {
		            try {
		                geofences = angular.fromJson(result);
		            } catch (ex) {

		            }
		        }
		        this._geofences = geofences;
            },
            getAll: function() {
                this.loadFromLocalStorage();
                return this._geofences;
            },
            addOrUpdate: function(geofence) {
                if ((this.createdGeofenceDraft && this.createdGeofenceDraft == geofence) ||
                    !this.findById(geofence.id)) {
                    this._geofences.push(geofence);
                }
                $window.geofence.addOrUpdate(geofence);
                localStorage['geofences'] = angular.toJson(this._geofences);
                if (this.createdGeofenceDraft) {
                    this.createdGeofenceDraft = null;
                }
            },
            findById: function(id) {
                if (this.createdGeofenceDraft && this.createdGeofenceDraft.id === id) {
                    return this.createdGeofenceDraft;
                }
                var geoFences = this._geofences.filter(function(g) {
                    return g.id === id
                });
                if (geoFences.length > 0) {
                    return geoFences[0];
                }
                return undefined;
            },
            remove: function(geofence) {
                this._geofences.splice(this._geofences.indexOf(geofence), 1);
                $window.geofence.remove(geofence.id);
                localStorage['geofences'] = angular.toJson(this._geofences);
            }
        };
        geofenceService.loadFromLocalStorage();
        return geofenceService;
    })
    .factory('geolocationService', function($q) {
        var currentPositionCache;
        return {
            getCurrentPosition: function() {
                var deffered = $q.defer();
                var success = function(position) {
                    deffered.resolve(currentPositionCache = position);
                };
                var error = function() {
                    deffered.reject();
                };

                navigator.geolocation.getCurrentPosition(success, error || function() {})
                navigator.geolocation.watchPosition(success, error || function() {}, {
                    enableHighAccuracy: true,
                    maximumAge: 3000,
                    timeout: 60000
                })
                if (currentPositionCache) setTimeout(function() {
                    success(currentPositionCache)
                }, 0);
                return deffered.promise;
            }
        };
    });
