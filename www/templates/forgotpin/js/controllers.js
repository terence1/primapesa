appControllers.controller('forgotpinCtrl', ['$scope', '$http', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdDialog', '$mdToast', 
function ($scope, $http, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdDialog, $mdToast) {
    
    // $rootScope.userphonenumber = '+254715549960';
    if (!$rootScope.userphonenumber){
        $scope.navigateTo('app.signup'); 
    }

    $scope.verify_details = function (){
        var config = {headers:  {
            "Content-Type":"json",
            }
        };

        var data = {
          'forgot_pin': true,
          'phone': $rootScope.userphonenumber,
          'national_id': $rootScope.forgot_id,
          'email': $rootScope.forgot_email
        };
        
        $http.post('http://52e7b166.ngrok.io/web/mobile', data).success(function(data, status, headers, config) {
            console.log(data.result);
            // update code IN LOCAL STORAGE
            if (data.result.type == 'correct_user_details'){
                var db = new PouchDB('userData');
                db.get('temp_code').then(function (doc) {
                  if (doc){
                    doc.code = data.result.code;
                    db.put(doc);
                  }else{
                    db.put({
                      _id: 'temp_code',
                      code: data.result.code
                    }).then(function (response) {
                      console.log(response);
                    }).catch(function (err) {
                      console.log(err);
                    });
                  }
                }).catch(function (err) {
                    console.log(err);
                    db.put({
                      _id: 'temp_code',
                      code: data.result.code
                    }).then(function (response) {
                      console.log(response);
                    }).catch(function (err) {
                      console.log(err);
                    });
                });
                $scope.showToast('Temporary code ' + data.result.code );
                $scope.navigateTo('app.forgotpin3');

            }else{
                $scope.showToast('Account Verification failed, Please try again.')
            }
            // $scope.create_phone_record(db, $rootScope.user_phone);
            // $rootScope.userphonenumber = $rootScope.user_phone;
            // $scope.navigateTo('app.login');
        }).error(function(data, status) { 
            console.log('failed');  
        });
    }

    $scope.forgotpin_email = function(email){
        $rootScope.forgot_email = email;
        $scope.navigateTo('app.forgotpin2');
    }

    $scope.forgotpin_id = function(id){
        $rootScope.forgot_id = id;
        $scope.verify_details();
        
    }

    $scope.forgotpin_code = function(code){
        var db = new PouchDB('userData');
        db.get('temp_code').then(function (doc) {
          console.log('get', doc.phone);
            if (doc.code == code){
                $scope.navigateTo('app.signup');
            }else{
                $scope.showToast('Temporary Code Incorrect');
            }
        }).catch(function (err) {
          console.log(err);

        });

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

