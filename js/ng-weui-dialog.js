(function() {

	// ng-weui-dialog	
	angular
		.module('ng-weui-dialog', [])
		.directive('weuiDialog', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-dialog-backdrop">'+
						        '<div class="weui-dialog">'+
						            '<div class="weui-dialog__hd"><strong class="weui-dialog__title" ng-bind="title"></strong></div>'+
						            '<div class="weui-dialog__bd" ng-bind="text"></div>'+
						            '<div class="weui-dialog__ft">'+
						                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" ng-if="cancelText" ng-click="cancel()" ng-bind="cancelText"></a>'+
						                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" ng-click="confirm()" ng-bind="confirmText"></a>'+
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
		.provider('weuiDialog', function () {
	        var defaults = this.defaults = {
	            className: undefined,
	            title: undefined,
	            text: undefined,
	            bodyClassName: 'ng-weui-dialog-open',
	            cancelText: '取消',
	            cancel: angular.noop,
	            confirmText: '确定',
	            confirm: angular.noop
	        }

	        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
	        	var self  = this,
	        		$el   = angular.element,
	        		$body = $el(document.body);

	        	var privateMethods = {

	        	}

	        	var publicMethods = {
	        		open: function(opts) {
	        			var scope = $rootScope.$new(true);

						angular.extend(scope, angular.copy(defaults), opts || {});

					    var element = scope.element = $compile('<weui-dialog></weui-dialog>')(scope);

					    $body.addClass(scope.bodyClassName).append(element);

					    scope.showDialog = function(callback) {
					    	if (scope.removed) return;
					    	element[0].offsetWidth;
							element.addClass('active');
					    }

					    scope.removeDialog = function(callback) {
					    	if (scope.removed) return;
					    	scope.removed = true;
							element.removeClass('active');
							element.on('transitionend', function() {
								element.remove();
								scope.cancel.$scope = element = null;
								(callback || angular.noop)();
							})
						}

						scope.cancel = function() {
							scope.removeDialog(opts.cancel);
						}

						scope.confirm = function() {
							scope.removeDialog(opts.confirm);
						}

						scope.showDialog();
						scope.cancel.$scope = scope;
						return scope.cancel;
	        		}
	        	}
	        	
	        	return publicMethods
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 