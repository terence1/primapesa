appControllers.controller('signupCtrl', ['$scope', '$http', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdToast', '$mdDialog',
function ($scope, $http, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdToast, $mdDialog) {

    $scope.showToast = function (toastText) {
        //Calling $mdToast.show to show toast.
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 1200,
            position: 'top',
            locals: {
                displayOption: {
                    // title: 'Going to ' + menuName + " !!"
                    title: toastText
                }
            }
        });
    }// End showToast.

    $scope.navigateTo = function (stateName) {
        $timeout(function () {
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAnimated  ? 300 : 0));
    }; // End of navigateTo.

    $scope.back = function() {
        $scope.navigateTo('app.start');
    }

    

}]);