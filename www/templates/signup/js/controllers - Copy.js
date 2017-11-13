appControllers.controller('signupCtrl', ['$scope', '$http', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdToast', '$mdDialog',
function ($scope, $http, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdToast, $mdDialog) {
    
    $scope.signup = function(firstname, lastname, phone, email, idno, staffno, pin, re_pin, terms_conditions){
        if (pin != re_pin){
            $scope.showToast('PINs are not the same');
        }else if (!terms_conditions){
            $scope.showToast('You need to Accept Terms and Conditions');
        }else if (!firstname || !lastname || !phone || !email || !idno || !pin){
            $scope.showToast('Some required fields are empty');
        }else{
            var config = {headers:  {
                "Content-Type":"json",
                }
            };

            var data = {
              'firstname': firstname,
              'lastname': lastname,
              'phone': phone,
              'email': email,
              'idno': idno,
              'staffno': staffno,
              'pin': pin,
            };

            $http.post('http://52e7b166.ngrok.io/web/mobile', data).success(function(data, status, headers, config) {
                $scope.successful_post(data.result.msg, data.result.action);

                // $scope.showToast('Some required fields are empty');
            }).error(function(data, status) { 
                console.log('failed');  
            });
        }
    }
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

    //After successful post to register, show error or proceed to login

    $scope.successful_post = function (msg, action, $event) {
        if (action == 'login'){
            $title = '';
            $ok = 'Login';
            $cancel = 'Cancel';
        }else if (action == 'contact_admin'){
            $title = '';
            $ok = 'Contact';
            $cancel = 'Cancel';
        }else{
            $title = '';
            $ok = 'Login';
            $cancel = 'Cancel';
        }

        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: $title,
                    content: msg,
                    ok: $ok,
                    cancel: $cancel,
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            if (action == 'login'){
                $scope.navigateTo('app.login');
            }else if(action == 'contact_admin'){
                // TODO: Open dialer with primapesa name
                console.log('primapesa contact_admin')
            }else{
                console.log('successful')
            }
           
        }, function () {
            // For cancel button to remove data.
            
        });// End alert box.
    }

}]);