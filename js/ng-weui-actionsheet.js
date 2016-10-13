(function() {

	// ng-weui-actionsheet	
	angular
		.module('ng-weui-actionsheet', [])
		.provider('weuiActionSheet', function () {
	        var defaults = this.defaults = {
				buttons: [],
				buttonClicked: angular.noop,
				cancelText: '取消',
				cancel: angular.noop,
				// destructiveText: '删除',
				// destructiveButtonClicked: angular.noop
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

	        			var tpl =   '<div class="weui-actionsheet" id="ng_weui_actionsheet">'+
						                '<div class="weui-actionsheet__menu">'+
						                	'<div class="weui-actionsheet__cell" ng-click="buttonClicked($index)" ng-repeat="b in buttons" ng-class="b.className" ng-bind="b.text"></div>'+
						                	'<div class="weui-actionsheet__cell" ng-if="destructiveText" ng-click="destructiveButtonClicked()" ng-bind="destructiveText"></div>'+
						                '</div>'+
						                '<div class="weui-actionsheet__action" ng-if="cancelText">'+
						                	'<div class="weui-actionsheet__cell" ng-click="cancel()" ng-bind="cancelText"></div>'+
						                '</div>'+
					                '</div>';

					    var $toggle = $el(tpl);
					    var $mask   = $el("<div class='ng-weui-mask-transition' id='ng_weui_mask_transition'></div>");

					    $mask.off().on('click', function() {
					    	scope.cancel();
					    })

					    var element = scope.element = $compile($toggle)(scope);
					    $body.append(element).append($mask);

					    scope.showSheet = function(callback) {
					    	if (scope.removed) return;
					    	$mask.addClass('ng-weui-fade-toggle').css({'display': 'block'});
							$toggle.addClass('weui-actionsheet_toggle');
					    }

					    scope.removeSheet = function(callback) {
					    	if (scope.removed) return;
					    	scope.removed = true;
							$mask.removeClass('ng-weui-fade-toggle').css({'display': 'none'});
							$toggle.removeClass('weui-actionsheet_toggle');
							$toggle.on('transitionend', function() {
								$toggle.remove();
								$mask.remove();
								scope.cancel.$scope = element = null;
								(callback || angular.noop)(opts.buttons);
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
	        		},
	        	}
	        	return publicMethods;
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 