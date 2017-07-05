(function() {

	// ng-weui-toptips	
	angular
		.module('ng-weui-toptips', [])
		.directive('weuiToptips', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-toptips-wrapper hidden" ng-class="className">'+
						        '<div class="weui-toptips" ng-class="cls">'+
						            '<weui-icon class="weui-toptips_icon" icon="{{icon}}" ng-if="!hidden"></weui-icon>'+
						            '<span ng-bind="text"></span>'+
						        '</div>'+
						    '</div>',
			    link: function($scope, $element) {
			    }
			}
		}])
		.provider('$weuiToptips', function () {
	        var defaults = this.defaults = {
	        	icon: 'cancel',
	        	hidden: true,
	        	text: undefined,
	        	timer: 1500,
	        	className: undefined,
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

						scope.cls = scope.icon ? ('weui-toptips_' + scope.icon) : 'weui-toptips_cancel'

					    var element = scope.element = $compile('<weui-toptips></weui-toptips>')(scope);

					    $body.append(element);

					    element.addClass('visible');
						element[0].offsetWidth;
						element.addClass('active');

					    scope.remove = function(callback) {
					    	$timeout(function() {
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
	        		},
	        		success: function(opts) {
						return this.show(extend(opts, {
							icon: 'success', 
						}))
					},
					info: function(opts) {
						return this.show(extend(opts, {
							icon: 'info', 
						}))
					},
					warn: function(opts) {
						return this.show(extend(opts, {
							icon: 'warn', 
						}))
					},
					error: function(opts) {
						return this.show(extend(opts, {
							icon: 'cancel', 
						}))
					},
	        	}

	        	return publicMethods
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 