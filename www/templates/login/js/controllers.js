appControllers.controller('loginCtrl', ['$scope', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdToast',
function ($scope, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdToast) {
        // $rootScope.userphonenumber = '+254715549960';
        if (!$rootScope.userphonenumber){
            $scope.navigateTo('app.signup'); 
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

    $rootScope.host = "http://app.primapesa.com";
    // $rootScope.host = "http://app.primapesa.com";
    $scope.database = 'primapesa';
    // $scope.database = 'primapesaaa';
    $scope.login_err1 = false;
    $scope.login_err2 = false;

    $scope.back = function() {
        $scope.navigateTo('app.start');
    }

    $scope.login = function(password) {
        // console.log($scope.pin, password);
        if(!password){
             $scope.showToast('PIN is missing');
        }
        // console.log(username, password);
        // var username = '+254715549960';
        // var password = '1234';
        // var username = 'admin';
        // var password = 'admin';
        jsonRpc.odoo_server = $rootScope.host;
        console.log($rootScope.userphonenumber, password);

        jsonRpc.login($scope.database, $rootScope.userphonenumber, password, session_id=null)
        .then(function(response) {
            console.log(response);
            console.log(response.session_id);
            $rootScope.sessionuid = response.uid;

            $timeout(function() {
                    console.log('go to page');
                    $scope.navigateTo('app.home'); 
                }, 600);

            // user
            // $scope.model = 'res.users';
            // $scope.domain = [['id', '=', response.uid]];
            // $scope.fields = ['display_name'];
            // jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
            // .then(function(response) {
            //     console.log('this user');
            //     console.log(response.records[0]);
            //     $rootScope.user = response.records[0];

                

            // },function(response){
            //     console.log(response.title);
            // });

            // //Employee with all loans
            // $scope.model = 'hr.employee';
            // $scope.domain = [['user_id', '=', response.uid]];
            // $scope.fields = [];
            // jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
            // .then(function(response) {
            //     console.log('this employee');
            //     console.log(response);
            //     $rootScope.employee = response.records[0];


            // },function(response){
            //     console.log(response.title);
            // });
            // NAVIGATE TO PAGE AFTER DATA HAS LOADED
            
            
        },function(response){
            if (response.title == 'wrong_login'){
                $scope.showToast('Phone Number or PIN is Incorrect');
            }else{
                $scope.showToast('Connection Error');
            }
        });

    }

    $scope.getuser = function(){

    // user
        $scope.model = 'res.users';
        $scope.domain = [['id', '=', 5]];
        $scope.fields = [];
        jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
        .then(function(response) {
            console.log('this user');
            console.log(response.records[0]);
            $rootScope.user = response.records[0];

            $timeout(function() {
                console.log('go to page');
                $scope.navigateTo('app.home'); 
            }, 600);

        },function(response){
            console.log(response);
        });
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
