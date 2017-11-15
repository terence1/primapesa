appControllers.controller('applyCtrl', ['$scope', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdDialog', '$mdToast', 
function ($scope, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdDialog, $mdToast) {
    $scope.loanlimit = ($rootScope.loan_type.salary_percentage * $rootScope.employee.total_salary) / 100;
    $scope.back = function(){
        $scope.navigateTo('app.home');
    }

    $scope.apply = function (loan_amount, $event) {
        if (loan_amount > $rootScope.employee.total_salary){
            $scope.apply_error = "Loan Applied Exceeds Loan Limit";
        }else{
            var loan_period = 1;
          
            // CONFIRM APPLICATION
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                targetEvent: $event,
                locals: {
                    displayOption: {
                        title: "Confirm Application?",
                        content: "Loan Application will be submitted.",
                        ok: "Confirm",
                        cancel: "Close"
                    }
                }
            }).then(function () {
                // APPLY LOAN
                $scope.model = 'hr.loan';
                $scope.domain = [];
                $scope.fields = [];
                $scope.method = 'create_loan_user';
                var date = new Date();
                var day = date.getDay();
                console.log(date);
                $scope.args = [{
                    'employee_id': $rootScope.employee.id,
                    // TODO: FIX THIS
                    // 'loan_type_id': $rootScope.loan_type.id,
                    // 'loan_type_id': 2,
                    'loan_amount': loan_amount,
                    // TODO: FIX THIS
                    // 'interest': $rootScope.loan_type.interest_amount,
                    'date_payment': day,
                    'manual_loan_period': loan_period,
                }];
                console.log('APPLY LOAN');
            
                $scope.kwargs = {}; 
                jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
                .then(function(response) {
                    if (!response){
                        $scope.apply_error = "Connection Error, Please try again!";
                    }
                    console.log('Success');
                    console.log(response);
                    // CONFIRM LOAN
                    $scope.model = 'hr.loan';
                    $scope.method = 'confirm_loan_user';
                    $scope.args = [response];
                    jsonRpc.call_btn($scope.model, $scope.method, $scope.args)
                    .then(function(response) {
                        console.log(response);
                        console.log('confirmation successfull'); 
                        // CONFIRM FOR SUCCESS
                        $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            targetEvent: $event,
                            locals: {
                                displayOption: {
                                    title: "Application Successfull!!",
                                    content: "We will get back Shortly.",
                                    ok: "Okay."
                                }
                            }    
                        }).then(function () {
                            $state.go("app.home");
                        });
                    }),function(response){
                        $scope.loanapplyfailed = true;
                        console.log(response);
                        console.log('confirmation failed'); 
                    } 
                    //END CONFIRMATION          
                }),function(response){
                    console.log('Failed');
                    console.log(response);
                }
                //END APPLY LOAN
            }, function () {
                // CANCEL APPLICATION.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: 'Cancelled'
                        }
                    }
                });// End showing toast.
            });// End alert box.
        }
    };// End save note.


    
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

