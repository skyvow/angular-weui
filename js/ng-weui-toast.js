(function() {

	// ng-weui-toast	
	angular
		.module('ng-weui-toast', [])
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
	        		close: function($toast) {
						var options = $toast.data('$ngToastOptions');
						$timeout(function() {
	        				$toast.remove();
	        				angular.isFunction(options.success) && options.success();
	        			}, options.timer)
	        		}
	        	}

	        	var publicMethods = {
	        		/*
                     * @param {Object} options:
                     * - type {String}
                     * - timer {Number}
                     * - text {String}
                     * - success {Function}
                     *
                     * @return {Object} toast
                     */
	        		message: function(opts) {
	        			var $toast, icon;
	        			var opts 	= opts || {};
	        			var options = angular.extend(angular.copy(defaults), opts);

	        			$toast = $el('<div id="toast">'+
								        '<div class="weui-mask_transparent"></div>'+
								        '<div class="weui-toast">'+
								            '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'+
								            '<p class="weui-toast__content">' + options.text + '</p>'+
								        '</div>'+
								    '</div>');

	        			if(options.type == 'forbidden') {
	        				$toast.addClass('ng-weui-toast-forbidden')
	        			}
	        			
	        			$toast.data('$ngToastOptions', options);

	        			$body.append($toast);

	        			privateMethods.close($toast);

	        			return publicMethods;
	        		}
	        	}

	        	return publicMethods
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 