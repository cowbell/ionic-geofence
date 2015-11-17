angular.module("ionic-geofence").factory("Geolocation", function ($q, $interval) {
    var currentPositionCache;

    return {
        getCurrentPosition: function () {
            if (!currentPositionCache) {
                var deffered = $q.defer();

                navigator.geolocation.getCurrentPosition(function (position) {
                    deffered.resolve(currentPositionCache = position);
                    $interval(function () {
                        currentPositionCache = undefined;
                    }, 10000, 1);
                }, function (error) {
                    deffered.reject(error);
                }, {timeout:10000, enableHighAccuracy: true});

                return deffered.promise;
            }

            return $q.when(currentPositionCache);
        }
    };
});
