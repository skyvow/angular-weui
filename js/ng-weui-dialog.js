(function() {

	// ng-weui-dialog	
	angular
		.module('ng-weui-dialog', [])
		.directive('weuiDialog', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-dialog-wrapper hidden">'+
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

					$scope.$on('$destroy', function() {
						$element.remove();
						$document.unbind('keyup', keyUp);
					});

					$document.bind('keyup', keyUp);
			    }
			}
		}])
		.provider('$weuiDialog', function () {
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

	        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$weuiBackdrop',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $weuiBackdrop) {
	        	var self   = this,
					$el    = angular.element,
					$body  = $el(document.body),
					extend = angular.extend,
					noop   = angular.noop,
					copy   = angular.copy;

	        	var privateMethods = {

	        	}

	        	var publicMethods = {
	        		open: function(opts) {
	        			var scope = $rootScope.$new(true);

						extend(scope, copy(defaults), opts || {});

					    var element = scope.element = $compile('<weui-dialog></weui-dialog>')(scope);

					    $body.addClass(scope.bodyClassName).append(element);

					    scope.showDialog = function(callback) {
					    	if (scope.removed) return;
					    	$weuiBackdrop.retain();
					    	var $backdrop = $weuiBackdrop.getElement()
					    	$backdrop.addClass('backdrop-dialog');
					    	$backdrop.off().on('click', function(e) {
					    		if ($backdrop.hasClass('backdrop-dialog')) {
					    			scope.cancel()
					    		}
					    	})
							element.addClass('visible');
					    	element[0].offsetWidth;
							element.addClass('active');
					    }

					    scope.removeDialog = function(callback) {
					    	if (scope.removed) return;
					    	scope.removed = true;
					    	$weuiBackdrop.release()
					    	$weuiBackdrop.getElement().removeClass('backdrop-dialog')
							element.removeClass('active');
							element.on('transitionend', function() {
								element.remove();
								scope.$destroy();
								scope.cancel.$scope = element = null;
								(callback || noop)();
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