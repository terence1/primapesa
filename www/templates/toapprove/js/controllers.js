appControllers.controller('toapproveCtrl', ['$scope', '$http', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdToast', '$mdDialog',
function ($scope, $http, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdToast, $mdDialog) {


    $scope.approve_this_loan = function(l, $event){
        console.log(l);
        // var content = l.name + " of " + l.employee_id.1 + " of company has applied for KES. " + l.loan_amount;
        var content = l.name + " of " + l.employee_id[1] + " of company " + l.company_id[1] + " has applied for KES. " + l.loan_amount;
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: 'Approve or Reject Loan?',
                    content: content,
                    ok: 'APPROVE',
                    cancel: 'REJECT',
                }
            }
        }).then(function () {
            // CONFIRM LOAN
            $scope.model = 'hr.loan';
            $scope.method = 'mobile_approve_loan';
            $scope.domain = [];
            $scope.fields = [];
            $scope.args = [l.id];
            $scope.kwargs = {}; 
            jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
            .then(function(response) {
                console.log('Loan is APROVED', response);
                
            }),function(response){
                console.log(response);
                console.log('Loan is APROVED failed'); 
            } 

        }, function () {
            // For cancel button to remove data.
            // CONFIRM LOAN
            $scope.model = 'hr.loan';
            $scope.method = 'mobile_reject_loan';
            $scope.domain = [];
            $scope.fields = [];
            $scope.args = [l.id];
            $scope.kwargs = {}; 
            jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
            .then(function(response) {
                console.log('Loan is REJECTED', response);
            }),function(response){
                console.log(response);
                console.log('Loan is REJECTED failed'); 
            } 

        });// End alert box.
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

    

}]);