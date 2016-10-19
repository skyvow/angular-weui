(function() {

	// ng-weui-loading	
	angular
		.module('ng-weui-loading', [])
		.directive('weuiLoading', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-loading hidden">'+
						        '<div class="weui-mask_transparent"></div>'+
						        '<div class="weui-toast">'+
						            '<i class="weui-loading weui-icon_toast"></i>'+
						            '<p class="weui-toast__content"></p>'+
						        '</div>'+
						    '</div>',
			    link: function($scope, $element) {
			    }
			}
		}])
		.provider('$weuiLoading', function () {
	        var defaults = this.defaults = {
				template: '数据加载中',
				templateUrl: null,
				hideOnStateChange: false
	        }

	        this.$get = ['$document', '$weuiTemplateLoader', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $weuiTemplateLoader, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
	        	var self   = this,
					$el    = angular.element,
					$body  = $el(document.body),
					extend = angular.extend,
					noop   = angular.noop,
					copy   = angular.copy;

	        	var privateMethods = {
	        		instance: null,
					getLoader: function() {
						if (!privateMethods.instance) {
							privateMethods.instance = $weuiTemplateLoader.compile({
								template: '<weui-loading></weui-loading>',
								appendTo: $body
							})
							.then(function(self) {
								self.show = function(options) {
									var templatePromise = options.templateUrl ? $weuiTemplateLoader.load(options.templateUrl) :	$q.when(options.template || options.content || '');

									self.scope = options.scope || self.scope;

									templatePromise.then(function(html) {
										if (html) {
											var loading = $el(self.element[0].querySelector('.weui-toast__content'));
											loading.html(html);
											$compile(loading.contents())(self.scope);
										}

										if (self.isShown) {
											self.element.addClass('visible');
											$body.addClass('ng-weui-loading-active');
										}
									});

									self.isShown = true;
								};

								self.hide = function() {
									if (self.isShown) {
										self.element.removeClass('visible');
										$body.removeClass('ng-weui-loading-active');
									}

									self.isShown = false;
									var loading = $el(self.element[0].querySelector('.weui-toast__content'));
									loading.html('');
								};

								return self;
							});
						}
						return privateMethods.instance;
					}
	        	}

	        	var publicMethods = {
	        		show: function(opts) {
	        			var options = extend(copy(defaults), opts);

						if (options.hideOnStateChange) {
							$rootScope.$on('$stateChangeSuccess', publicMethods.hide);
							$rootScope.$on('$stateChangeError', publicMethods.hide);
						}

						return privateMethods.getLoader()
						.then(function(loader) {
							return loader.show(options);
						});
	        		},
	        		hide: function() {
						return privateMethods.getLoader()
						.then(function(loader) {
							return loader.hide();
						});
	        		}
	        	}
	        	
	        	return publicMethods;
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 