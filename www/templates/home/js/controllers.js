appControllers.controller('homeCtrl', ['$scope', '$ionicLoading', '$filter', '$rootScope', '$timeout', '$ionicHistory', '$stateParams', '$state', 'jsonRpc', '$rootScope', '$mdDialog', '$mdToast', '$ionicPopup',
function ($scope, $ionicLoading, $filter, $rootScope, $timeout, $ionicHistory, $stateParams, $state, jsonRpc, $rootScope, $mdDialog, $mdToast, $ionicPopup) {
    //LOADER Setup the loader
    $scope.loading = $ionicLoading.show({
        content: '<div class="ionic-logo"></div>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 0,
        showDelay: 0
    });
    // Set a timeout to clear loader
    $timeout(function () {
        $ionicLoading.hide().then(function(){
            console.log("The loading indicator is now hidden");
        });
    }, 1000);

    $scope.load_employee = function (){
    //Employee with all loans
        $scope.model = 'hr.employee';
        $scope.domain = [['user_id', '=', $rootScope.sessionuid]];
        $scope.fields = [];
        jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
        .then(function(response) {
            console.log('this employee');
            console.log(response);
            $rootScope.employee = response.records[0];
            if ($rootScope.employee){
                $scope.load_employee_loans();
                $scope.load_types();
            }else{
                $scope.showToast('Restart App, Data not loaded');
            }
        },function(response){
            console.log(response.title);
        });
    }

    $scope.load_employee_loans = function (){
        // CONFIRM LOAN
        $scope.model = 'hr.loan';
        $scope.method = 'user_loans';
        $scope.domain = [];
        $scope.fields = [];
        $scope.args = [$rootScope.employee.id];
        $scope.kwargs = {}; 
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
            console.log('all loans', response);
            $rootScope.employee_loans = response;
            $scope.assign_loans();
        }),function(response){
            console.log(response);
            console.log('confirmation failed'); 
        } 
    }

    $scope.load_employee_loans_to_approve = function (){
        // CONFIRM LOAN
        $scope.model = 'hr.loan';
        $scope.method = 'user_loans_to_approve';
        $scope.domain = [];
        $scope.fields = [];
        $scope.args = [];
        $scope.kwargs = {}; 
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
            console.log('all loans to approve', response);
            $rootScope.loans_toapprove = response;
        }),function(response){
            console.log(response);
            console.log('confirmation failed'); 
        } 
    }
    $scope.load_types = function (){
        $scope.model = 'hr.loan';
        $scope.method = 'loan_types';
        $scope.domain = [];
        $scope.fields = [];
        $scope.args = [$rootScope.employee.address_id.id];
        $scope.kwargs = {}; 
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
             console.log('NEW TYPES', response);
             if (response == ''){
                $scope.showToast('Loan Types Not Loaded, Restart App');
             }else{
                $rootScope.loan_type = response[0];
             }
            
        }),function(response){
            console.log(response);
            console.log('confirmation failed'); 
        } 
    }

    //LOAD Employee All Loans
    // $scope.model = 'hr.loan';
    // $scope.domain = [['employee_id', '=', $rootScope.employee.id]];
    // $scope.fields = [];
    // console.log('domain', $scope.domain);
    // jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
    // .then(function(response) {
    //     console.log(response);
    //     $rootScope.employee_loans = response.records;
    //     console.log('NEW LOANS');
    //     console.log($rootScope.employee_loans);
    // },function(response){
    //     console.log(response.title);
    // });
    // LOAN TYPES
    // $scope.model = 'hr.loan.type';
    // $scope.domain = [];
    // $scope.fields = [];
    // jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
    // .then(function(response) {
    //     console.log('NEW TYPES', response);
    //     $rootScope.loan_type = response.records[0];
    // },function(response){
    //     console.log(response);
    // });

    $scope.check_user_primapesa_admin = function (){
        console.log('IS PRIMAPESA ADMIN');
        $scope.model = 'res.users';
        $scope.method = 'check_user_primapesa_admin';
        $scope.domain = [];
        $scope.fields = [];
        $scope.args = [$rootScope.sessionuid];
        $scope.kwargs = {}; 
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
             console.log('IS PRIMAPESA ADMIN', response);
             if (response){
                $rootScope.isprimapesa_admin = true;
                $scope.load_employee_loans_to_approve();
             }
            
        }),function(response){
            console.log(response);
            console.log('confirmation failed'); 
        }
        
    }

    $scope.load_employee();
    $scope.check_user_primapesa_admin();

    $timeout(function() {
    }, 800);

    $scope.addloanstateclass  = 'green';
    
    $scope.assign_loans = function(){
        $rootScope.loan_confirm = [];
        $rootScope.loan_approve = [];
        $rootScope.loan_active = [];
        $rootScope.loan_cancel = [];
        $rootScope.loan_done = [];
        console.log('ALL MY LOAN: ');
        console.log($rootScope.employee_loans);
        console.log('ACTIVE LOANS: ');
        if ($rootScope.employee_loans){
            var confirm = $filter('filter')($rootScope.employee_loans, {state: 'confirm'}, true);
             if (confirm.length) {
                $rootScope.loan_confirm.push(confirm[0]);
                console.log('UNJSON: CONFIRM ');
                $scope.addloanstateclass  = 'red';
                console.log(confirm[0]);
             } else {
                console.log('Not found CONFORM');
             }
             var approve = $filter('filter')($rootScope.employee_loans, {state: 'approve'}, true);
             if (approve.length) {
                // $rootScope.loan_approve = approve[0];
                $rootScope.loan_approve.push(approve[0]);
                console.log('UNJSON: APROVE ');
                $scope.addloanstateclass  = 'red';
                console.log(approve[0]);
             } else {
                console.log('Not found APROVE');
             }
             var active = $filter('filter')($rootScope.employee_loans, {state: 'active'}, true);
             if (active.length) {
                // $rootScope.loan_active = active[0];
                $rootScope.loan_active.push(active[0]);
                console.log('UNJSON: ACTIVE ');
                $scope.addloanstateclass  = 'red';
                console.log(active[0]);
             } else {
                console.log('Not found ACTIVE');
             }
             var cancel = $filter('filter')($rootScope.employee_loans, {state: 'cancel'}, true);
             if (cancel.length) {
                // $rootScope.loan_cancel = cancel;
                $rootScope.loan_cancel.push(cancel[0]);
                console.log('UNJSON: CANCEL');
                console.log(cancel);
             } else {
                console.log('Not found CANCEL');
             }
             var done = $filter('filter')($rootScope.employee_loans, {state: 'done'}, true);
             if (done.length) {
                // $rootScope.loan_done = done;
                $rootScope.loan_done.push(done[0]);
                console.log('UNJSON: DONE');
                console.log(done);
             } else {
                console.log('Not found DONE');
             }
        } 
        if(!$rootScope.employee.total_salary){
            $scope.addloanstateclass  = 'red';
        } 
    }

    $scope.addloanstateclass  = 'green';

    $scope.stateGo = function (menuName) {
        if (menuName == 'apply'){
            if(!$rootScope.employee.total_salary){
                $scope.showToast('Your Account is has no salary record');
            }else if($rootScope.loan_approve.length || $rootScope.loan_active.length || $rootScope.loan_confirm.length){
                console.log('TEST', $rootScope.loan_approve, $rootScope.loan_active, $rootScope.loan_confirm);
                $scope.showToast('You have current loan');
            }else{
                $state.go('app.'+menuName+'');  
            }
        }else if(menuName == 'limit'){
            $state.go('app.'+menuName+'');
        }else{
            $state.go('app.'+menuName+'');
        }
        
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

}]);// End of controller menu dashboard.

