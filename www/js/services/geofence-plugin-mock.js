angular.module("ionic-geofence").factory("GeofencePluginMock", function ($q, $log) {
    return {
        addOrUpdate: function (fences) {
            var deffered = $q.defer();

            $log.log("Mocked geofence plugin addOrUpdate", fences);
            deffered.resolve();

            return deffered.promise;
        },
        remove: function (ids) {
            var deffered = $q.defer();

            $log.log("Mocked geofence plugin remove", ids);
            deffered.resolve();

            return deffered.promise;
        },
        removeAll: function () {
            var deffered = $q.defer();

            $log.log("Mocked geofence plugin removeAll");
            deffered.resolve();

            return deffered.promise;
        },
        initialize: function () {},
        receiveTransition: function () {},
        TransitionType: {
            ENTER: 1,
            EXIT: 2,
            BOTH: 3
        }
    };
});
