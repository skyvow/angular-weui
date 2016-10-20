(function() {

	// ng-weui-toast	
	angular
		.module('ng-weui-toast', [])
		.directive('weuiToast', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-toast-wrapper hidden">'+
						        '<div class="weui-toast">'+
						            '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'+
						            '<p class="weui-toast__content" ng-bind="text"></p>'+
						        '</div>'+
						    '</div>',
			    link: function($scope, $element) {
			    }
			}
		}])
		.provider('$weuiToast', function () {
	        var defaults = this.defaults = {
	        	type: 'default',
	        	timer: 1500,
	        	text: '已完成',
	        	noBackdrop: true,
	        	success: angular.noop
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
	        		show: function(opts) {
	        			var scope = $rootScope.$new(true);

						extend(scope, copy(defaults), opts || {});

					    var element = scope.element = $compile('<weui-toast></weui-toast>')(scope);

					    if(scope.type == 'forbidden') {
	        				element.addClass('ng-weui-toast-forbidden');
	        			}

					    $body.append(element);

					    if (!scope.noBackdrop) {
							$weuiBackdrop.retain();
							$weuiBackdrop.getElement().addClass('backdrop-toast');
						}

					    element.addClass('visible');
						element[0].offsetWidth;
						element.addClass('active');

					    scope.remove = function(callback) {
					    	$timeout(function() {
					    		if (!scope.noBackdrop) {
									$weuiBackdrop.release();
									$weuiBackdrop.getElement().removeClass('backdrop-toast');
								}

								element.removeClass('visible active');
		        				element.remove();
		        				scope.$destroy();
								(callback || noop)();
		        			}, scope.timer)
						}

						scope.cancel = function() {
							scope.remove(opts.success);
						}

						scope.cancel();
	        		}
	        	}

	        	return publicMethods
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 