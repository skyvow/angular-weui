(function() {

	// ng-weui-dialog	
	angular
		.module('ng-weui-dialog', [])
		.provider('weuiDialog', function () {
	        var defaults = this.defaults = {
	        	type: 'confirm',
	            className: undefined,
	            title: undefined,
	            text: undefined,
	            buttons: [
	            	{
	            		text: '取消',
	            	},
	            	{
	            		text: '确定',
	            	}
	            ],
	            bodyClassName: 'ngdialog-open',
	            cancel: angular.noop,
	            confirm: angular.noop
	        }

	        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
	        	var self  = this,
	        		$el   = angular.element,
	        		$body = $el(document.body);

	        	var privateMethods = {
	        		dialogId: 0,
	        		closeDialog: function (event, $dialog) {
	        			var target	   = $el(event.target),
	        				options    = $dialog.data('$ngDialogOptions'),
                        	isOverlay  = target.hasClass('weui-mask'),
                        	isCloseBtn = target.hasClass('weui-dialog__btn');

                        if (isOverlay || isCloseBtn) {
                        	$body.removeClass(options.bodyClassName)
                        	$dialog.remove()
                         	angular.isFunction(options.cancel) && (isOverlay || target.attr('data-cancel')) && options.cancel()
                         	angular.isFunction(options.confirm) && target.attr('data-confirm') && options.confirm()
                        }
                    }
	        	}

	        	var publicMethods = {
	        		/*
                     * @param {Object} options:
                     * - type {String} - dialog type
                     * - className {String} - dialog theme class
                     * - title {String} - dialog title
                     * - text {String} - dialog text
                     * - cancel {Function} - dialog cancel function
                     * - confirm {Function} - dialog confirm function
                     * - bodyClassName {String} - class added to body at open dialog
                     * @return {Object} dialog
                     */
	        		open: function(opts) {
	        			var $dialog;
	        			var opts = opts || {}
	        			var options = angular.extend(angular.copy(defaults), opts);
	        			var cancelText = options.buttons[0].text
	        			var confirmText = options.buttons[1].text

	        			if (options.type == 'confirm') {
		        			$dialog = $el('<div class="weui_dialog_confirm">'+
								        '<div class="weui-mask"></div>'+
								        '<div class="weui-dialog">'+
								            '<div class="weui-dialog__hd"><strong class="weui-dialog__title">' + options.title +'</strong></div>'+
								            '<div class="weui-dialog__bd">' + options.text +'</div>'+
								            '<div class="weui-dialog__ft">'+
								                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" data-cancel="2016">' + cancelText +'</a>'+
								                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" data-confirm="2016">' + confirmText + '</a>'+
								            '</div>'+
								       '</div>'+
								    '</div>')
	        			}

	        			if (options.type == 'alert') {
		        			$dialog = $el('<div class="weui_dialog_alert">'+
								        '<div class="weui-mask"></div>'+
								        '<div class="weui-dialog">'+
								            '<div class="weui-dialog__hd"><strong class="weui-dialog__title">' + options.title +'</strong></div>'+
								            '<div class="weui-dialog__bd">' + options.text +'</div>'+
								            '<div class="weui-dialog__ft">'+
								                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" data-confirm="2016">' + confirmText + '</a>'+
								            '</div>'+
								        '</div>'+
								    '</div>')
	        			}

	        			$dialog.data('$ngDialogOptions', options);
	        			$body.addClass(options.bodyClassName).append($dialog)

	        			options.className && $dialog.addClass(options.className)
	        			$dialog.attr({'id': 'weui-dialog_' + (++privateMethods.dialogId)})

	        			$dialog.on('click', function(event) {
	        				privateMethods.closeDialog(event, $dialog)
	        			})

	        			return publicMethods;
	        		},
	        		close: function() {
	        			var dialog  = document.getElementById('weui-dialog_' + privateMethods.dialogId),
	        				$dialog = $el(dialog);
	        			if (!dialog) return;
	        			$body.removeClass('weuiDialog-open')
	        			$dialog.remove()
	        		},
	        		getDefaults: function () {
                        return defaults;
                    }
	        	}
	        	return publicMethods
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }

	    })
	
})(); 