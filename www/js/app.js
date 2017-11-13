//
//Welcome to app.js
//This is main application config of project. You can change a setting of :
//  - Global Variable
//  - Theme setting
//  - Icon setting
//  - Register View
//  - Spinner setting
//  - Custom style
//
//Global variable use for setting color, start page, message, oAuth key.
var db = null; //Use for SQLite database.
window.globalVariable = {
    //custom color style variable
    color: {
        appPrimaryColor: "#ed1c23",
        dropboxColor: "#017EE6",
        facebookColor: "#3C5C99",
        foursquareColor: "#F94777",
        googlePlusColor: "#D73D32",
        instagramColor: "#517FA4",
        wordpressColor: "#0087BE"
    },// End custom color style variable
    startPage: {
        url: "/app/start",//Url of start page.
        state: "app.start"//State name of start page.
    },
    message: {
        errorMessage: "Technical error please try again later." //Default error message.
    },
    oAuth: {
      dropbox: "your_api_key",//Use for Dropbox API clientID.
      facebook: "your_api_key",//Use for Facebook API appID.
      foursquare: "your_api_key", //Use for Foursquare API clientID.
      instagram: "your_api_key",//Use for Instagram API clientID.
      googlePlus: "your_api_key",//Use for Google API clientID.
    },
    adMob: "your_api_key" //Use for AdMob API clientID.
};// End Global variable


angular.module('starter', ['ionic','ionic.service.core','ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services', 'ngMaterial', 'ngMessages', 'ngCordova', 'ngCookies', 'odoo'])
    .run(function ($ionicPlatform, $cordovaSQLite, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet, $ionicPopup) {

        //Deploy changes
        var deploy = new Ionic.Deploy();
        deploy.watch().then(function() {}, function() {}, function(updateAvailable) {
            if (updateAvailable) {
                console.log('test');
              deploy.download().then(function() {
                deploy.extract().then(function() {
                  deploy.unwatch();
                  $ionicPopup.show({
                    title: 'Update available',
                    subTitle: 'An update was just downloaded. Would you like to restart your app to use the latest features?',
                    buttons: [
                      { text: 'Not now' },
                      {
                        text: 'Restart',
                        onTap: function(e) {
                          deploy.load();
                        }
                      }
                    ]
                  });
                });
              });
            }
        });

        //Create database table of contracts by using sqlite database.
        //Table schema :
        //Column	   Type	     Primary key
        //  id	        Integer	    Yes
        //  firstName	Text	    No
        //  lastName	Text	    No
        //  telephone	Text	    No
        //  email	    Text	    No
        //  note	    Text	    No
        //  createDate	DateTime	No
        //  age	        Integer	    No
        //  isEnable	Boolean	    No

        function initialSQLite() {
            db = window.cordova ? $cordovaSQLite.openDB("contract.db") : window.openDatabase("contract.db", "1.0", "IonicMaterialDesignDB", -1);
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS contracts " +
                "( id           integer primary key   , " +
                "  firstName    text                  , " +
                "  lastName     text                  , " +
                "  telephone    text                  , " +
                "  email        text                  , " +
                "  note         text                  , " +
                "  createDate   dateTime              , " +
                "  age          integer               , " +
                "  isEnable     Boolean)                ");
        };
        // End creating SQLite database table.

        // Create custom defaultStyle.
        function getDefaultStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important; " +
                "   border-style            : none;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom defaultStyle

        // Create custom style for product view.
        function getProductStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important;" +
                "   border-style            : none;" +
                "   background-image        : url('img/background_cover_pixels.png') !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom style for product view.

        // Create custom style for contract us view.
        function getContractUsStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : transparent !important;" +
                "   border-style            : none;" +
                "   background-image        : none !important;" +
                "   background-position-y   : 4px !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        } // End create custom style for contract us view.

        // Create custom style for Social Network view.
        function getSocialNetworkStyle(socialColor) {
            return "" +
                ".material-background-nav-bar {" +
                "   background              : " + socialColor + " !important;" +
                "   border-style            : none;" +
                "} " +
                "md-ink-bar {" +
                "   color                   : " + socialColor + " !important;" +
                "   background              : " + socialColor + " !important;" +
                "}" +
                "md-tab-item {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle {" +
                "   border-left-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle, md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "    border-top-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-gap {" +
                "   border-top-color        : " + socialColor + " !important;" +
                "   border-bottom-color     : " + socialColor + " !important;" +
                "}" +
                "md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "  border-right-color       : " + socialColor + " !important;" +
                " }" +
                ".spinner-android {" +
                "   stroke                  : " + socialColor + " !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                "a.md-button.md-primary, .md-button.md-primary {" +
                "   color                   : " + socialColor + " !important;" +
                "}";
        }// End create custom style for Social Network view.


        function initialRootScope() {
            $rootScope.appPrimaryColor = appPrimaryColor;// Add value of appPrimaryColor to rootScope for use it to base color.
            $rootScope.isAndroid = ionic.Platform.isAndroid();// Check platform of running device is android or not.
            $rootScope.isIOS = ionic.Platform.isIOS();// Check platform of running device is ios or not.
        };

        function hideActionControl() {
            //For android if user tap hardware back button, Action and Dialog should be hide.
            $mdBottomSheet.cancel();
            $mdDialog.cancel();
        };


        // createCustomStyle will change a style of view while view changing.
        // Parameter :
        // stateName = name of state that going to change for add style of that page.
        function createCustomStyle(stateName) {
            var customStyle =
                ".material-background {" +
                "   background-color          : " + appPrimaryColor + " !important;" +
                "   border-style              : none;" +
                "}" +
                ".spinner-android {" +
                "   stroke                    : " + appPrimaryColor + " !important;" +
                "}";

            switch (stateName) {
                case "app.productList" :
                case "app.productDetail":
                case "app.productCheckout":
                case "app.clothShop" :
                case "app.catalog" :
                    customStyle += getProductStyle();
                    break;
                case "app.dropboxLogin" :
                case "app.dropboxProfile":
                case "app.dropboxFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.dropboxColor);
                    break;
                case "app.facebookLogin" :
                case "app.facebookProfile":
                case "app.facebookFeed" :
                case "app.facebookFriendList":
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.facebookColor);
                    break;
                case "app.foursquareLogin" :
                case "app.foursquareProfile":
                case "app.foursquareFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.foursquareColor);
                    break;
                case "app.googlePlusLogin" :
                case "app.googlePlusProfile":
                case "app.googlePlusFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.googlePlusColor);
                    break;
                case "app.instagramLogin" :
                case "app.instagramProfile":
                case "app.instagramFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.instagramColor);
                    break;
                case "app.wordpressLogin" :
                case "app.wordpressFeed":
                case "app.wordpressPost" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.wordpressColor);
                    break;
                case "app.contractUs":
                    customStyle += getContractUsStyle();
                    break;
                default:
                    customStyle += getDefaultStyle();
                    break;
            }
            return customStyle;
        }// End createCustomStyle

        // Add custom style while initial application.
        $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);

        $ionicPlatform.ready(function () {
            // Check for network [internet] connection
            if(window.Connection) {
              if(navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                  title: 'No Internet Connection',
                  content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
                })
                .then(function(result) {
                  if(!result) {
                    ionic.Platform.exitApp();
                  }
                });
              }
            }

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
        
            // ionic.Platform.isFullScreen = true;
            // if (window.cordova && window.cordova.plugins.Keyboard) {
            //     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            //     cordova.plugins.Keyboard.disableScroll(true);
            // }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            initialSQLite();
            initialRootScope();


            //

            //Checking if view is changing it will go to this function.
            $rootScope.$on('$ionicView.beforeEnter', function () {
                //hide Action Control for android back button.
                hideActionControl();
                // Add custom style ti view.
                $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
            });
        });

    })

    .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider, $mdColorPalette, $mdIconProvider) {


        // Use for change ionic spinner to android pattern.
        $ionicConfigProvider.spinner.icon("android");
        $ionicConfigProvider.views.swipeBackEnabled(false);

        // mdIconProvider is function of Angular Material.
        // It use for reference .SVG file and improve performance loading.
        $mdIconProvider
            .icon('facebook', 'img/icons/facebook.svg')
            .icon('twitter', 'img/icons/twitter.svg')
            .icon('mail', 'img/icons/mail.svg')
            .icon('message', 'img/icons/message.svg')
            .icon('share-arrow', 'img/icons/share-arrow.svg')
            .icon('more', 'img/icons/more_vert.svg');

        //mdThemingProvider use for change theme color of Ionic Material Design Application.
        /* You can select color from Material Color List configuration :
         * red
         * pink
         * purple
         * purple
         * deep-purple
         * indigo
         * blue
         * light-blue
         * cyan
         * teal
         * green
         * light-green
         * lime
         * yellow
         * amber
         * orange
         * deep-orange
         * brown
         * grey
         * blue-grey
         */
        //Learn more about material color patten: https://www.materialpalette.com/
        //Learn more about material theme: https://material.angularjs.org/latest/#/Theming/01_introduction
        $mdThemingProvider
            .theme('default')
            .primaryPalette('red')
            .accentPalette('green');

        appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.

        //$stateProvider is using for add or edit HTML view to navigation bar.
        //
        //Schema :
        //state_name(String)      : Name of state to use in application.
        //page_name(String)       : Name of page to present at localhost url.
        //cache(Bool)             : Cache of view and controller default is true. Change to false if you want page reload when application navigate back to this view.
        //html_file_path(String)  : Path of html file.
        //controller_name(String) : Name of Controller.
        //
        //Learn more about ionNavView at http://ionicframework.com/docs/api/directive/ionNavView/
        //Learn more about  AngularUI Router's at https://github.com/angular-ui/ui-router/wiki
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu/html/menu.html",
                controller: 'menuCtrl'
            })
            .state('app.start', {
                url: "/start",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/start/html/start.html",
                        controller: 'startCtrl'
                    }
                }
            })
            .state('app.login', {
                url: "/login",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/login/html/login.html",
                        controller: 'loginCtrl'
                    }
                }
            })
            .state('app.signup', {
                url: "/signup",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/signup/html/signup.html",
                        controller: 'signupCtrl'
                    }
                }
            })
            .state('app.setpwd', {
                url: "/setpwd",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/setpwd/html/setpwd.html",
                        controller: 'setpwdCtrl'
                    }
                }
            })
            .state('app.changepin', {
                url: "/changepin",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/setpwd/html/changepin.html",
                        controller: 'setpwdCtrl'
                    }
                }
            })
            .state('app.forgotpin', {
                url: "/forgotpin",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/forgotpin/html/forgotpin.html",
                        controller: 'forgotpinCtrl'
                    }
                }
            })
            .state('app.forgotpin2', {
                url: "/forgotpin2",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/forgotpin/html/forgotpin2.html",
                        controller: 'forgotpinCtrl'
                    }
                }
            })
            .state('app.forgotpin3', {
                url: "/forgotpin3",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/forgotpin/html/forgotpin3.html",
                        controller: 'forgotpinCtrl'
                    }
                }
            })
            .state('app.confirmpwd', {
                url: "/confirmpwd",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/setpwd/html/confirmpwd.html",
                        controller: 'setpwdCtrl'
                    }
                }
            })
            .state('app.home', {
                url: "/home",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/home/html/home.html",
                        controller: "homeCtrl"
                    }
                }
            })
            .state('app.apply', {
                url: "/apply",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/apply/html/apply.html",
                        controller: "applyCtrl"
                    }
                }
            })
            .state('app.repay', {
                url: "/repay",
                views: {
                    'menuContent': {
                        templateUrl: "templates/repay/html/repay.html"
                    }
                }
            })
            .state('app.status', {
                url: "/status",
                views: {
                    'menuContent': {
                        templateUrl: "templates/status/html/status.html"
                    }
                }
            })
            .state('app.toapprove', {
                url: "/toapprove",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/toapprove/html/toapprove.html",
                        controller: "toapproveCtrl"
                    }
                }
            })
            .state('app.contactus', {
                url: "/contactus",
                views: {
                    'menuContent': {
                        templateUrl: "templates/contactus/html/contactus.html",
                        controller: 'contactusCtrl'
                    }

                }
            })
            .state('app.faqs', {
                url: "/faqs",
                views: {
                    'menuContent': {
                        templateUrl: "templates/faqs/html/faqs.html"
                    }
                }
            })
            .state('app.myaccount', {
                url: "/myaccount",
                params: {
                    mydetail: null,
                    actionDelete: false
                },
                views: {
                    'menuContent': {
                        templateUrl: "templates/myaccount/html/account.html",
                        controller: 'myaccountCtrl'
                    }
                }
            })
            .state('app.mysetting', {
                url: "/mysetting",
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: "templates/myaccount/html/mysetting.html",
                        controller: 'mySettingCtrl'
                    }
                }
            })
            // .state('app.mylist', {
            //     url: "/mylist",
            //     cache: false,
            //     params:{
            //         isAnimated:(ionic.Platform.isAndroid()==false)
            //     },
            //     views: {
            //         'menuContent': {
            //             templateUrl: "templates/myaccount/html/mylist.html",
            //             controller: 'myListCtrl'
            //         }
            //     }
            // })
            .state('app.news', {
                url: "/news",
                views: {
                    'menuContent': {
                        templateUrl: "templates/news/html/news.html"
                    }
                }
            })
            .state('app.works', {
                url: "/works",
                views: {
                    'menuContent': {
                        templateUrl: "templates/works/html/works.html"
                    }
                }
            });
            
            
        //Use $urlRouterProvider.otherwise(Url);
        $urlRouterProvider.otherwise(window.globalVariable.startPage.url);

    });
