angular.module("ionic-geofence").directive("hideKeyboardOnEnter", function ($window) {
    return {
        restrict: "A",
        link: function (scope, element) {
            if ($window.cordova && $window.cordova.plugins.Keyboard) {
                element.bind("keyup", function (key) {
                    if (key.keyCode === 13) {
                        $window.cordova.plugins.Keyboard.close();
                        element[0].blur();
                    }
                });
            }
        }
    };
});
