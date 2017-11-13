appControllers.controller('signupCtrl', ['$scope', '$http', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdToast', '$mdDialog',
function ($scope, $http, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdToast, $mdDialog) {
    // create db
    // var db = new PouchDB('userData');
    // $scope.destroy_db = function (db){
    //     db.destroy().then(function (response) {
    //       // success
    //       console.log(response);
    //     }).catch(function (err) {
    //       console.log(err);
    //     });
    // }

    // $scope.create_phone_record = function (db, phone){
    //     console.log('create_phone_record');
    //     db.put({
    //       _id: 'user_number01111222',
    //       phone: phone
    //     }).then(function (response) {
    //       // handle response
    //       console.log(response);
    //     }).catch(function (err) {
    //       console.log(err);
    //     });
    // }

    // $scope.get_phone_record = function (db){
    //     var db = new PouchDB('userData');
    //     console.log(db);
    //     db.get('user_number1234321').then(function (doc) {
    //       // handle doc
    //       console.log('mmemememe');
    //       console.log('get', doc);
    //     }).catch(function (err) {
    //       console.log('err', err);
    //     });
    // }

    // $scope.create_phone_record(db, $scope.phone);
    // $scope.get_phone_record(db);

    // $scope.pouchdbSupported = !!db.adapter;

    $scope.signup = function(phone){
        console.log(phone);
        if (!phone){
            $scope.showToast('Phone Number Entry Incorerect');
        }else{
            $rootScope.user_phone = '+254' + phone;
            var config = {headers:  {
                "Content-Type":"json",
                }
            };

            var data = {
              'phone': $rootScope.user_phone,
              
            };
            console.log(data);
            
            $http.post('http://52e7b166.ngrok.io/web/mobile', data).success(function(data, status, headers, config) {
                console.log(data.result);
                $scope.successful_post(data.result.msg, data.result.type);

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

    $scope.back = function() {
        $scope.navigateTo('app.start');
    }

    //After successful post to register, show error or proceed to login

    $scope.successful_post = function (msg, type, $event) {
        console.log(msg, type);
        if (type == 'active_user'){
            $title = '';
            $ok = 'Login';
            $cancel = 'Cancel';
        }else if (type == 'no_user'){
            $title = '';
            $ok = 'Contact';
            $cancel = 'Cancel';
        }else if (type == 'not_active_user'){
            $title = '';
            $ok = 'Activate';
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
            if (type == 'active_user'){
                $scope.navigateTo('app.login');
            }else if(type == 'no_user'){
                // TODO: Open dialer with primapesa name
                console.log('primapesa contact_admin');
            }else if(type == 'not_active_user'){
                // TODO: Redirect to setpin
                $scope.navigateTo('app.setpwd');
                console.log('primapesa contact_admin');
            }else{
                console.log('successful');
            }
           
        }, function () {
            // For cancel button to remove data.
            
        });// End alert box.
    }

}]);