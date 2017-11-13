appControllers.controller('myaccountCtrl', ['$scope', '$window', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdDialog', '$mdToast', 
function ($scope, $window, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdDialog, $mdToast) {
    
    $scope.destroy_db = function (db){
        db.destroy().then(function (response) {
          // success
          console.log('successfull deleted db', response);
        }).catch(function (err) {
          console.log('deleting db error',err);
        });
    }

    $scope.logout = function(){
        jsonRpc.logout();
        $scope.navigateTo('app.start');
    }

    $scope.back = function(){
        $scope.navigateTo('app.home');
    }

    $scope.deactivate_user = function (){
        $scope.model = 'res.users';
        $scope.method = 'deactivate_user';
        $scope.domain = [];
        $scope.fields = [];
        $scope.args = [{
            'phone': $rootScope.userphonenumber
        }];
        $scope.kwargs = {}; 
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
            console.log('does user exist?', response);
        }),function(response){
            console.log(response);
            console.log('does user exist ERROR'); 
        } 
    }

    $scope.resetapp = function ($event) {
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: 'Confirm RESET APP',
                    content: 'This will erase app data and the process cannot be undone',
                    ok: 'RESET APP',
                    cancel: 'CANCEL',
                }
            }
        }).then(function () {
            var db = new PouchDB('userData');
            $scope.destroy_db(db);
            $scope.deactivate_user();
            $scope.navigateTo('app.start');
            $window.location.reload(true);
        }, function () {
            // For cancel button to remove data.
        });// End alert box.
         
    }

    $scope.stateGo = function (menuName) {
        $state.go('app.'+menuName+'');  
    }

    $scope.showToast = function (toastText) {
        //Calling $mdToast.show to show toast.
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    // title: 'Going to ' + menuName + " !!"
                    title: toastText
                }
            }
        });
    }// End showToast.

    //$scope.isAnimated is the variable that use for receive object data from state params.
    //For enable/disable row animation.
    $scope.isAnimated =  $stateParams.isAnimated;

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination state. 
    // Parameter :  
    // stateNames = target state to go.
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

    // goToSetting is for navigate to Dashboard Setting page
    $scope.goToSetting = function () {
        $state.go("app.dashboardSetting");
    };// End goToSetting.

    $scope.showListBottomSheet = function ($event, contractForm) {
        $scope.disableSaveBtn = $scope.validateRequiredField(contractForm);
        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.


}]);// End of controller menu dashboard.

