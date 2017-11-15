appControllers.controller('setpwdCtrl', ['$scope', '$http', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdToast',
function ($scope, $http, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdToast) {
          var db = new PouchDB('userData');
      $scope.create_phone_record = function (db, phone){
        db.put({
          _id: 'user_number',
          phone: phone
        }).then(function (response) {
          // handle response
          console.log(response);
        }).catch(function (err) {
          console.log(err);
        });
    }

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

    
    $scope.setpwd = function(pin){
        console.log(pin);
        if (!pin){
             $scope.showToast('PIN Entry Incorrect');
        }else{
            $rootScope.current_pin = pin;
            $scope.navigateTo('app.confirmpwd');
        }
    }

    $scope.check_old_pin = function(pin){
        console.log(pin);
        if (!pin){
             $scope.showToast('PIN Entry Incorrect');
        }else{
            $scope.model = 'res.users';
            $scope.method = 'check_old_pin';
            $scope.domain = [];
            $scope.fields = [];
            $scope.args = [{
                'phone': $rootScope.userphonenumber,
                'oldpin': pin
            }];
            $scope.kwargs = {}; 
            jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
            .then(function(response) {
                console.log('does user exist?', response);
                if (response){
                    $scope.navigateTo('app.setpwd');
                }else{
                    $scope.showToast('PIN is Incorrect');
                    $timeout(function () {
                        $scope.navigateTo('app.login');
                    }, 400);
                    
                }
                
            }),function(response){
                console.log(response);
                console.log('does user exist ERROR'); 
            } 
            
        }
    }

    $scope.confirmpwd = function(repin){
        console.log(repin);
        if (!repin){
             $scope.showToast('PIN Entry Incorrect');
        }else{
            if ($rootScope.current_pin == repin){
                $scope.call_set_pin(repin);
            }else{
                $scope.showToast('PIN Does not Match');
            }
        }
    }

    $scope.back_to_setpwd = function(){
        $scope.navigateTo('app.setpwd');
    }

    $scope.call_set_pin = function(pin){
        var config = {headers:  {
            "Content-Type":"json",
            }
        };

        var data = {
          'pin': pin,
          'phone': $rootScope.user_phone,
          'set_pin': true,
        };
        
        $http.post('http://app.primapesa.com/web/mobile', data).success(function(data, status, headers, config) {
            console.log(data.result);
            // CREATE CONTACT IN LOCAL STORAGE

            $scope.create_phone_record(db, $rootScope.user_phone);
            $rootScope.userphonenumber = $rootScope.user_phone;
            $scope.navigateTo('app.login');


        }).error(function(data, status) { 
            console.log('failed');  
        });
    }

    $scope.back = function() {
        $scope.navigateTo('app.start');
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


$(".toggle-password").click(function() {

  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});

   
}]);
