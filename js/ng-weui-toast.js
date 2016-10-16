(function() {

	// ng-weui-toast	
	angular
		.module('ng-weui-toast', [])
		.directive('weuiToast', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-toast-wrapper">'+
						        '<div class="weui-mask_transparent"></div>'+
						        '<div class="weui-toast">'+
						            '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'+
						            '<p class="weui-toast__content" ng-bind="text"></p>'+
						        '</div>'+
						    '</div>',
			    link: function($scope, $element) {
			    }
			}
		}])
		.provider('weuiToast', function () {
	        var defaults = this.defaults = {
	        	type: 'default',
	        	timer: 1500,
	        	text: '已完成',
	        	success: angular.noop
	        }

	        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
	        	var self  = this,
	        		$el   = angular.element,
	        		$body = $el(document.querySelector('body'));

	        	var privateMethods = {
	        		
	        	}

	        	var publicMethods = {
	        		show: function(opts) {
	        			var scope = $rootScope.$new(true);

						angular.extend(scope, angular.copy(defaults), opts || {});

					    var element = scope.element = $compile('<weui-toast></weui-toast>')(scope);

					    if(scope.type == 'forbidden') {
	        				element.addClass('ng-weui-toast-forbidden');
	        			}

					    $body.append(element);

					    scope.remove = function(callback) {
					    	$timeout(function() {
		        				element.remove();
								(callback || angular.noop)();
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