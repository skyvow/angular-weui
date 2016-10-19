(function() {

	// ng-weui-popup	
	angular
		.module('ng-weui-popup', [])
		.directive('weuiPopup', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-dialog-backdrop" ng-class="className">'+
						        '<div class="weui-dialog">'+
						            '<div class="weui-dialog__hd"><strong class="weui-dialog__title" ng-bind="title"></strong></div>'+
						            '<div class="weui-dialog__bd"></div>'+
						            '<div class="weui-dialog__ft" ng-show="buttons.length">'+
						                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" ng-repeat="button in buttons" ng-click="$buttonTapped(button, $event)" ng-class="button.type || \'button-default\'" ng-bind="button.text"></a>'+
						            '</div>'+
						       '</div>'+
						    '</div>',
			    link: function($scope, $element) {
					var keyUp = function(e) {
						if (e.which == 27) {
							var $popup = $element.data('$ngWeuiPopup')
							$popup.responseDeferred.promise.close();
							$scope.$apply();
						}
					};

					var backdropClick = function(e) {
						if (e.target == $element[0]) {
							var $popup = $element.data('$ngWeuiPopup')
							$popup.responseDeferred.promise.close();
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
		.provider('$weuiPopup', function () {
			var defaults = this.defaults = {
	        	cancelText: '取消',
	        	cancelType: 'weui-dialog__btn_default',
	        	okText: '确定',
	        	okType: 'weui-dialog__btn_primary'
	        }

	        this.$get = ['$q', '$timeout', '$rootScope', '$compile', '$weuiTemplateLoader', 
            function ($q, $timeout, $rootScope, $compile, $weuiTemplateLoader) {
	        	var self   = this,
					$el    = angular.element,
					$body  = $el(document.body),
					extend = angular.extend,
					noop   = angular.noop,
					copy   = angular.copy;

				var config = {
					stackPushDelay: 75
				}

				var popupStack = [];

	        	var publicMethods = {
					show        : showPopup,
					alert       : showAlert,
					confirm     : showConfirm,
					prompt      : showPrompt,
					_createPopup: createPopup,
					_popupStack : popupStack
	        	}

	        	return publicMethods;

				function createPopup(options) {
					options = extend({
						scope  : null,
						title  : '',
						buttons: []
					}, options || {});

					var self = {};
					self.scope = (options.scope || $rootScope).$new();
					self.element = $el('<weui-popup></weui-popup>');
					self.responseDeferred = $q.defer();

					$compile(self.element)(self.scope);

					self.element.data('$ngWeuiPopup', self)

					extend(self.scope, {
						title: options.title,
						buttons: options.buttons,
						className: options.className,
						$buttonTapped: function(button, event) {
							var result = (button.onTap || noop).apply(self, [event]);
							event = event.originalEvent || event; 

							if (!event.defaultPrevented) {
								self.responseDeferred.resolve(result);
							}
						}
					});

					var POPUP_TPL = options.templateUrl ? $weuiTemplateLoader.load(options.templateUrl) : (options.template || options.content || '')

					$q.when(POPUP_TPL).then(function(template) {
						var popupBody = $el(self.element[0].querySelector('.weui-dialog__bd'));
						if (template) {
							popupBody.html(template);
							$compile(popupBody.contents())(self.scope);
						} else {
							popupBody.remove();
						}
					});

					self.show = function() {
						if (self.isShown || self.removed) return;

						self.isShown = true;
						if (!self.isShown) return;
						$body.append(self.element);
						self.element[0].offsetWidth;
						self.element.addClass('active');
					};

					self.hide = function(callback) {
						callback = callback || noop;
						if (!self.isShown) return callback();

						self.isShown = false;
						self.element.removeClass('active');
						$timeout(callback, 250, false);
					};

					self.remove = function() {
						if (self.removed) return;

						self.hide(function() {
							self.element.remove();
							self.scope.$destroy();
						});

						self.removed = true;
					};

					return self;
				}

				function showPopup(options) {
					var popup = publicMethods._createPopup(options);

					var showDelay = 0;

					if (popupStack.length > 0) {
						showDelay = config.stackPushDelay;
						$timeout(popupStack[popupStack.length - 1].hide, showDelay, false);
					} else {
						$body.addClass('ng-weui-popup-open');
					}

					popup.responseDeferred.promise.close = function popupClose(result) {
						if (!popup.removed) popup.responseDeferred.resolve(result);
					};
					popup.responseDeferred.notify({ close: popup.responseDeferred.close });

					doShow();

					return popup.responseDeferred.promise;

					function doShow() {
						popupStack.push(popup);
						$timeout(popup.show, showDelay, false);

						popup.responseDeferred.promise.then(function(result) {
							var index = popupStack.indexOf(popup);
							if (index !== -1) {
								popupStack.splice(index, 1);
							}

							popup.remove();

							if (popupStack.length > 0) {
								popupStack[popupStack.length - 1].show();
							} else {
								$timeout(function() {
									if (!popupStack.length) {
										$body.removeClass('ng-weui-popup-open');
									}
								}, 400, false);
							}

							return result;
						});
					}
				}

				function showAlert(options) {
					return showPopup(extend({
						buttons: [
							{
								text: options.okText || defaults.okText,
								type: options.okType || defaults.okType,
								onTap: function() {
									return true;
								}
							}
						]
					}, options || {}));
				}	

				function showConfirm(options) {
					return showPopup(extend({
						buttons: [
							{
								text: options.cancelText || defaults.cancelText,
								type: options.cancelType || defaults.cancelType,
								onTap: function() { 
									return false; 
								}
							}, 
							{
								text: options.okText || defaults.okText,
								type: options.okType || defaults.okType,
								onTap: function() { 
									return true; 
								}
							}
						]
					}, options || {}));
				}

				function showPrompt(options) {
					var scope = $rootScope.$new(true);
					scope.data = {};
					scope.data.fieldtype = options.inputType ? options.inputType : 'text';
					scope.data.response = options.defaultText ? options.defaultText : '';
					scope.data.placeholder = options.inputPlaceholder ? options.inputPlaceholder : '';
					scope.data.maxlength = options.maxLength ? parseInt(options.maxLength) : '';
					var text = '';
					if (options.template && /<[a-z][\s\S]*>/i.test(options.template) === false) {
						text = '<span>' + options.template + '</span>';
						delete options.template;
					}
					return showPopup(extend({
						template: 	text + '<input class="weui-input" ng-model="data.response" '
										+ 'type="{{ data.fieldtype }}"'
										+ 'maxlength="{{ data.maxlength }}"'
										+ 'placeholder="{{ data.placeholder }}"'
										+ '>',
						scope: scope,
						buttons: [
							{
								text: options.cancelText || defaults.cancelText,
								type: options.cancelType || defaults.cancelType,
								onTap: function() {}
							}, 
							{
								text: options.okText || defaults.okText,
								type: options.okType || defaults.okType,
								onTap: function() {
									return scope.data.response || '';
								}
							}
						]
					}, options || {}));
				}
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 