(function() {

	// ng-weui-actionsheet	
	angular
		.module('ng-weui-actionsheet', [])
		.directive('weuiActionSheet', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-action-sheet-backdrop">'+
        						'<div class="weui-actionsheet">'+
					                '<div class="weui-actionsheet__menu">'+
					                	'<div class="weui-actionsheet__cell" ng-click="buttonClicked($index)" ng-repeat="b in buttons" ng-class="b.className" ng-bind="b.text"></div>'+
					                	'<div class="weui-actionsheet__cell destructive action-sheet-destructive" ng-if="destructiveText" ng-click="destructiveButtonClicked()" ng-bind="destructiveText"></div>'+
					                '</div>'+
					                '<div class="weui-actionsheet__action" ng-if="cancelText">'+
					                	'<div class="weui-actionsheet__cell" ng-click="cancel()" ng-bind="cancelText"></div>'+
					                '</div>'+
				                '</div>'+
			                '</div>',
			    link: function($scope, $element) {
					var keyUp = function(e) {
						if (e.which == 27) {
							$scope.cancel();
							$scope.$apply();
						}
					};

					var backdropClick = function(e) {
						if (e.target == $element[0]) {
							$scope.cancel();
							$scope.$apply();
						}
					};

					$scope.$on('$destroy', function() {
						$element.remove();
						$document.unbind('keyup', keyUp);
					});

					$document.bind('keyup', keyUp);
					$element.bind('click', backdropClick);
			    }
			}
		}])
		.provider('$weuiActionSheet', function () {
	        var defaults = this.defaults = {
				buttons: [],
				buttonClicked: angular.noop,
				cancelText: '取消',
				cancel: angular.noop,
				// destructiveText: '删除',
				// destructiveButtonClicked: angular.noop,
				cancelOnStateChange: true
	        }

	        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
	        	var self   = this,
					$el    = angular.element,
					$body  = $el(document.body),
					extend = angular.extend,
					noop   = angular.noop,
					copy   = angular.copy;

	        	var privateMethods = {

	        	}

	        	var publicMethods = {
	        		show: function(opts) {
						var scope = $rootScope.$new(true);

						extend(scope, copy(defaults), opts || {});

					    var element = scope.element = $compile('<weui-action-sheet></weui-action-sheet>')(scope);
					    var sheetEl = $el(element[0].querySelector('.weui-actionsheet'));

					    var stateChangeListenDone = scope.cancelOnStateChange ? $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); }) : noop;

					    $body.append(element);

					    scope.showSheet = function(callback) {
					    	if (scope.removed) return;
					    	element[0].offsetWidth;
							element.addClass('active');
							sheetEl.addClass('weui-actionsheet_toggle');
					    }

					    scope.removeSheet = function(callback) {
					    	if (scope.removed) return;
					    	scope.removed = true;
							sheetEl.removeClass('weui-actionsheet_toggle');
							element.removeClass('active');
							stateChangeListenDone();
							element.on('transitionend', function() {
								element.remove();
								scope.cancel.$scope = element = null;
								(callback || noop)(opts.buttons);
							})
						}

						scope.buttonClicked = function(index) {
							if (opts.buttonClicked(index, opts.buttons[index]) === true) {
								scope.removeSheet();
							}
						}

						scope.destructiveButtonClicked = function() {
							if (opts.destructiveButtonClicked() === true) {
								scope.removeSheet();
							}
						}

						scope.cancel = function() {
							scope.removeSheet(opts.cancel);
						}

						scope.showSheet();
						scope.cancel.$scope = scope;
						return scope.cancel;
	        		}
	        	}
	        	
	        	return publicMethods;
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 