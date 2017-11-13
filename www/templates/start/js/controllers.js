appControllers.controller('startCtrl', ['$scope', '$http', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdToast', '$mdDialog',
function ($scope, $http, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdToast, $mdDialog) {

    // create db
    var db = new PouchDB('userData');
    $scope.get_phone_record = function (db){
        db.get('user_number').then(function (doc) {
          // handle doc
          console.log('get', doc.phone);
          $rootScope.userphonenumber = doc.phone;
        }).catch(function (err) {
          console.log(err);
        });
    }
    $scope.get_phone_record(db);

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

}]);