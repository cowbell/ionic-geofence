angular.module('ionic-geofence')
    .factory('geofenceService', function($window, $q, $log, $ionicLoading) {
        
        $window.geofence = $window.geofence || {
            addOrUpdate: function(fences) {
                var deffered = $q.defer();
                $log.log('Mocked geofence plugin addOrUpdate', fences);
                deffered.resolve();
                return deffered.promise;
            },
            remove: function(ids) {
                var deffered = $q.defer();
            	$log.log('Mocked geofence plugin remove', ids);
                deffered.resolve();
                return deffered.promise;
            },
            removeAll: function(){
                var deffered = $q.defer();
            	$log.log('Mocked geofence plugin removeAll');
                deffered.resolve();
                return deffered.promise;
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
                var self = this;
                $ionicLoading.show({
                    template: 'Removing geofence...'
                });
                $window.geofence.remove(geofence.id).then(function(){
                    $ionicLoading.hide();
                    self._geofences.splice(self._geofences.indexOf(geofence), 1);    
                    localStorage['geofences'] = angular.toJson(self._geofences);    
                },function(reason){
                    $ionicLoading.show({
                        template: 'Error',
                        duration: 1500
                    });
                });
            },
            removeAll: function(){
                var self = this;
                $ionicLoading.show({
                    template: 'Removing all geofences...'
                });
                $window.geofence.removeAll().then(function(){
                    $ionicLoading.hide();
                    self._geofences.length = 0;
                    localStorage['geofences'] = angular.toJson(self._geofences);
                },function(reason){
                    $ionicLoading.show({
                        template: 'Error',
                        duration: 1500
                    });
                });
            },
            getNextNotificationId: function(){
                var max = 0;
                this._geofences.forEach(function(gf){
                    if(gf.notification && gf.notification.id){
                        if(gf.notification.id > max){
                            max = gf.notification.id;
                        }
                    }
                });
                return max+1;
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
