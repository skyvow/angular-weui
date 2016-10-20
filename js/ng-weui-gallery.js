(function() {

	// ng-weui-gallery	
	angular
		.module('ng-weui-gallery', [])
		.provider('$weuiGallery', function () {
	        var defaults = this.defaults = {
	        	urls: [],
	        	index: 0,
	        	cancel: angular.noop,
	        	delete: angular.noop,
	        	animation: 'fade-in'
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

	        			var element = scope.element = $compile('<weui-slide-box show-pager="false" active-slide="index" class="weui-gallery-wrapper">'+
				    			'<weui-slide ng-repeat="item in urls track by $index">'+
					    			'<div class="weui-gallery">'+
							            '<span class="weui-gallery__img" style="background-image:url({{item}})" ng-click="cancel()"></span>'+
							            '<div class="weui-gallery__opr">'+
							                '<a href="javascript:" class="weui-gallery__del" ng-click="delete($index)">'+
							                    '<i class="weui-icon-delete weui-icon_gallery-delete"></i>'+
							                '</a>'+
							            '</div>'+
							        '</div>'+
						        '</<weui-slide>'+
					        '</weui-slide-box>')(scope);
	        			
	        			element.addClass(scope.animation);
	        			$body.append(element);
	        			
	        			scope.show = function(callback) {
					    	if (scope.removed) return;
					    	element.addClass('ng-enter active').removeClass('ng-leave ng-leave-active');
					    	element[0].offsetWidth;
							element.addClass('ng-enter-active');
					    }

	        			scope.remove = function(callback) {
					    	if (scope.removed) return;
					    	scope.removed = true;
					    	element.addClass('ng-leave ng-leave-active').removeClass('ng-enter ng-enter-active active');
							element.on('transitionend', function() {
								element.remove();
								scope.cancel.$scope = element = null;
								(callback || noop)(opts.urls);
							})
						}

	        			scope.cancel = function() {
							scope.remove(opts.cancel);
						}

						scope.delete = function(index) {
							if (opts.delete(index, opts.urls[index]) === true) {
								scope.remove();
							}
						}

						scope.show();
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