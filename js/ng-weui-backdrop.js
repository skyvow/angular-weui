(function() {

	// ng-weui-backdrop	
	angular
		.module('ng-weui-backdrop', [])
		.provider('$weuiBackdrop', function () {
	        this.$get = ['$document', '$timeout', '$$rAF', '$rootScope', 
            function ($document, $timeout, $$rAF, $rootScope) {
	        	var self   = this,
					$el    = angular.element,
					$body  = $el(document.body),
					extend = angular.extend,
					noop   = angular.noop,
					copy   = angular.copy;

	        	var privateMethods = {
	        		backdropHolds: 0,
	        		_el: $el('<div class="weui-mask hidden"></div>'),
	        		_init: function() {
	        			$body.append(privateMethods._el)
	        		}
	        	}

	        	var publicMethods = {
	        		getElement: function() {
	        			return privateMethods._el
	        		},
	        		retain: function() {
						privateMethods.backdropHolds++;
						if (privateMethods.backdropHolds === 1) {
							privateMethods._el.addClass('visible');
							$rootScope.$broadcast('backdrop.shown');
							$$rAF(function() {
								if (privateMethods.backdropHolds >= 1) privateMethods._el.addClass('active');
							});
						}
	        		},
	        		release: function() {
						if (privateMethods.backdropHolds === 1) {
							privateMethods._el.removeClass('active');
							$rootScope.$broadcast('backdrop.hidden');
							$timeout(function() {
								if (privateMethods.backdropHolds === 0) privateMethods._el.removeClass('visible');
							}, 400, false);
						}
						privateMethods.backdropHolds = Math.max(0, privateMethods.backdropHolds - 1);
	        		}
	        	}

	        	privateMethods._init();
	        	
	        	return publicMethods;
	        }]
	    })
	
})(); 