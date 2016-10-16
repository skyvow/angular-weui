(function() {

	// ng-weui-gallery	
	angular
		.module('ng-weui-gallery', [])
		.directive('weuiGallery', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="weui-gallery">'+
					            '<span class="weui-gallery__img" style="background-image:url({{url}})" ng-click="cancel()"></span>'+
					            '<div class="weui-gallery__opr">'+
					                '<a href="javascript:" class="weui-gallery__del" ng-click="delete()">'+
					                    '<i class="weui-icon-delete weui-icon_gallery-delete"></i>'+
					                '</a>'+
					            '</div>'+
					        '</div>',
			    link: function($scope, $element) {
			    }
			}
		}])
		.provider('weuiGallery', function () {
	        var defaults = this.defaults = {
	        	url: undefined,
	        	cancel: angular.noop,
	        	delete: angular.noop
	        }

	        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
	        	var self  = this,
	        		$el   = angular.element,
	        		$body = $el(document.body);

	        	var privateMethods = {
	        		
	        	}

	        	var publicMethods = {
	        		show: function(opts) {
	        			var scope = $rootScope.$new(true);

	        			angular.extend(scope, angular.copy(defaults), opts || {});

	        			var element = scope.element = $compile('<weui-gallery></weui-gallery>')(scope);
	        			
	        			$body.append(element);

	        			scope.show = function(callback) {
					    	if (scope.removed) return;
					    	element[0].offsetWidth;
							element.addClass('weui-gallery_toggle');
					    }

					    scope.remove = function(callback) {
					    	if (scope.removed) return;
					    	scope.removed = true;
							element.removeClass('weui-gallery_toggle');
							element.on('transitionend', function() {
								element.remove();
								scope.cancel.$scope = element = null;
								(callback || angular.noop)(opts.url);
							})
						}

						scope.cancel = function() {
							scope.remove(opts.cancel);
						}

						scope.delete = function() {
							scope.remove(opts.delete);
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