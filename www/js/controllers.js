angular.module('ionic-geofence')
    .controller('GeofencesCtrl', function($scope, $state, geolocationService, geofenceService, $ionicLoading) {
        $scope.geofences = geofenceService.getAll();

        $scope.createNew = function() {
            $ionicLoading.show({
                template: 'Obtaining current location...'
            });
            geolocationService.getCurrentPosition()
                .then(function(position) {
                    $ionicLoading.hide();
                    geofenceService.createdGeofenceDraft = {
                        id: UUIDjs.create().toString(),
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        radius: 1000,
                        transitionType: 1,
                        notification: {
                        	title: 'Ionic geofence example',
                        	text: '',
                        	openAppOnClick: true
                        }
                    };
                    geofenceService.createdGeofenceDraft.notification.data = angular.copy(geofenceService.createdGeofenceDraft);
                    $state.go('geofence', {
                        geofenceId: geofenceService.createdGeofenceDraft.id
                    });
                })
                .catch(function(){
              		$ionicLoading.show({
              			template: 'Cannot obtain current location',
              			duration: 1500
              		});
                });
        }

        $scope.editGeofence = function(geofence) {
            $state.go('geofence', {
                geofenceId: geofence.id
            });
        }

        $scope.removeGeofence = function(geofence) {
            geofenceService.remove(geofence);
        }
    })

.controller('GeofenceCtrl', function($scope, $state, geofence, geofenceService) {
    $scope.geofence = geofence;

    $scope.center = {
        lat: geofence.latitude,
        lng: geofence.longitude,
        zoom: 12
    };
    $scope.markers = {
        marker: {
            draggable: true,
            message: geofence.notification.text,
            lat: geofence.latitude,
            lng: geofence.longitude,
            icon: {}
        }
    };
    $scope.paths = {
        circle: {
            type: "circle",
            radius: geofence.radius,
            latlngs: $scope.markers.marker,
            clickable: false
        }
    };

    $scope.isWhenGettingCloser = function() {
        return $scope.geofence.transitionType === 1;
    }

    $scope.chooseWhenIgetCloser = function() {
        $scope.geofence.transitionType = 1;
    }

    $scope.chooseWhenIamLeaving = function() {
        $scope.geofence.transitionType = 0;
    }

    $scope.save = function() {
    	$scope.geofence.radius = parseInt($scope.paths.circle.radius);
    	$scope.geofence.latitude = $scope.markers.marker.lat;
    	$scope.geofence.longitude = $scope.markers.marker.lng;
        geofenceService.addOrUpdate($scope.geofence);
        $state.go('geofences');
    }
})
