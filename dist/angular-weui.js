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
(function() {

	// ng-weui-fileUpload	
	angular
		.module('ng-weui-fileUpload', [])
		.factory('weuiFileReader', ['$q', function ($q) {
	        var onLoad = function(reader, deferred, scope) {
		        return function () {
		            scope.$apply(function () {
		                deferred.resolve(reader.result);
		            });
		        };
		    };

		    var onError = function (reader, deferred, scope) {
		        return function () {
		            scope.$apply(function () {
		                deferred.reject(reader.result);
		            });
		        };
		    };

		    var getReader = function(deferred, scope) {
		        var reader = new FileReader();
		        reader.onload = onLoad(reader, deferred, scope);
		        reader.onerror = onError(reader, deferred, scope);
		        return reader;
		    };

		    var readAsDataURL = function (file, scope) {
		        var deferred = $q.defer();
		        var reader = getReader(deferred, scope);         
		        reader.readAsDataURL(file);
		        return deferred.promise;
		    };

		    return {
		        readAsDataUrl: readAsDataURL  
		    };
	    }])
		.provider('weuiFileOptimization', function () {
			var defaults = this.defaults = {
	        	maxWidth: 640,
	            maxHeight: 640,
	        }

	        this.$get = ['$q', '$http', function ($q, $http) {
	        	var self  = this;
	        	var privateMethods = {
	        		dataURItoBlob: function(dataURI) {
	        			// convert base64/URLEncoded data component to raw binary data held in a string
			            var byteString
			            if (dataURI.split(',')[0].indexOf('base64') >= 0){
			                byteString = atob(dataURI.split(',')[1])
			            } else {
			                byteString = unescape(dataURI.split(',')[1])
			            }

			            // separate out the mime component
			            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

			            // write the bytes of the string to a typed array
			            var ia = new Uint8Array(byteString.length)
			            for (var i = 0; i < byteString.length; i++) {
			                ia[i] = byteString.charCodeAt(i)
			            }

			            return new Blob([ia], {
			                type: mimeString
			            })
	        		},
	        		resizeFile: function(file, opts) {
	        			var deferred = $q.defer()
			            var img      = document.createElement("img")
			            var opts	 = opts || {}
			            var options  = angular.extend(angular.copy(defaults), opts)

			            try {
			                var reader = new FileReader()
			                reader.onload = function(e) {
			                    img.src = e.target.result

			                    //resize the image using canvas
			                    var canvas = document.createElement("canvas")
			                    var ctx    = canvas.getContext("2d")
			                    ctx.drawImage(img, 0, 0)

			                    var MAX_WIDTH  = options.maxWidth
			                    var MAX_HEIGHT = options.maxHeight
			                    var width      = img.width
			                    var height     = img.height
			                    if (width > height) {
			                        if (width > MAX_WIDTH) {
			                            height *= MAX_WIDTH / width
			                            width  = MAX_WIDTH
			                        }
			                    } else {
			                        if (height > MAX_HEIGHT) {
			                            width  *= MAX_HEIGHT / height
			                            height = MAX_HEIGHT
			                        }
			                    }
			                    canvas.width  = width
			                    canvas.height = height

			                    var ctx = canvas.getContext("2d")
			                    ctx.drawImage(img, 0, 0, width, height)

			                    //change the dataUrl to blob data for uploading to server
			                    var dataURL = canvas.toDataURL('image/jpeg')
			                    var data    = {}

			                    data.base64 = dataURL
			                    data.blob   = privateMethods.dataURItoBlob(dataURL)
			                    
			                    deferred.resolve(data)
			                }
			                reader.readAsDataURL(file)
			            } catch (e) {
			                deferred.resolve(e)
			            }

			            return deferred.promise
	        		}
	        	}

	        	return {
		            resizeFile: privateMethods.resizeFile
		        }
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
		})
		.directive('weuiFileModel', ['$parse', function($parse){
			return {
				restrict: 'A',
				link: function(scope, element, attrs, ngModel) {
			        var model       = $parse(attrs.weuiFileModel),
			            modelSetter = model.assign;
			        element.bind('change', function(event){
			            scope.$apply(function(){
			                modelSetter(scope, element[0].files[0]);
			            });
			            //附件预览
			            scope.file = (event.srcElement || event.target).files[0];
			            scope.$apply(attrs.fileFn);
			        });
			    }
			};
		}])
	
})(); 
(function() {

	// ng-weui-gallery	
	angular
		.module('ng-weui-gallery', [])
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

	        			var tpl = 	'<div class="weui-gallery">'+
							            '<span class="weui-gallery__img" style="background-image:url({{url}})" ng-click="cancel()"></span>'+
							            '<div class="weui-gallery__opr">'+
							                '<a href="javascript:" class="weui-gallery__del" ng-click="delete()">'+
							                    '<i class="weui-icon-delete weui-icon_gallery-delete"></i>'+
							                '</a>'+
							            '</div>'+
							        '</div>';

	        			var element = scope.element = $compile(tpl)(scope);
	        			$body.append(element);

	        			scope.show = function(callback) {
					    	if (scope.removed) return;
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
(function() {

	// ng-weui-msg	
	angular
		.module('ng-weui-msg', [])
		.directive('weuiMsg', function(){
			return {
				scope: {
					type: '@',
					title: '@',
					desc: '@',
					onSuccess: '&',
					onWarn: '&',
				},
				restrict: 'E',
				template:   '<div class="weui-msg">'+
						        '<div class="weui-msg__icon-area"><i class="weui-icon_msg" ng-class="cls"></i></div>'+
						        '<div class="weui-msg__text-area">'+
						            '<h2 class="weui-msg__title">{{title}}</h2>'+
						            '<p class="weui-msg__desc">{{desc}}</p>'+
						        '</div>'+
						        '<div class="weui-msg__opr-area">'+
						            '<p class="weui-btn-area">'+
						                '<a href="javascript:void(0);" class="weui-btn weui-btn_primary" ng-click="onSuccess()">确定</a>'+
						                '<a href="javascript:void(0);" class="weui-btn weui-btn_default" ng-click="onWarn()">取消</a>'+
						            '</p>'+
						        '</div>'+
						        '<div class="weui-msg__extra-area" ng-transclude></div>'+
						    '</div>',
				replace: true,
				transclude: true,
				link: function($scope, iElm, iAttrs, controller) {
					$scope.cls = iAttrs.type === 'warn' ? {'weui-icon-warn' : !0} : {'weui-icon-success' : !0}
				}
			};
		})
	
})(); 
(function() {

	// ng-weui-panel	
	angular
		.module('ng-weui-panel', [])
		.directive('weuiPanel', function(){
			return {
				scope: {
					title: '@',
					viewMore: '&'
				},
				restrict: 'AE',
				template:   '<div class="weui-panel weui-panel_access">'+
								'<div class="weui-panel__hd" ng-if="!!title">{{title}}</div>'+
								'<div class="weui-panel__bd" ng-transclude></div>'+
								'<div class="weui-panel__ft">'+
					                '<a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link" ng-if="show" ng-click="viewMore()">'+
					                    '<div class="weui-cell__bd">查看更多</div>'+
					                    '<span class="weui-cell__ft"></span>'+
					                '</a>'+    
					            '</div>'+
							'</div>',
				replace: true,
				transclude: true,
				link: function($scope, iElm, iAttrs, controller) {
					$scope.show = !!iAttrs.viewMore && angular.isFunction($scope.viewMore)
				}
			};
		})
		.directive('panelAppmsg', function(){
			return {
				scope: {
					image: '=',
					title: '=',
					desc: '='
				},
				require: '^?weuiPanel',
				restrict: 'E',
				template:   '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">'+
				                '<div class="weui-media-box__hd" ng-if="!!image">'+
				                    '<img class="weui-media-box__thumb" ng-src="{{image}}" alt="">'+
				                '</div>'+
				                '<div class="weui-media-box__bd">'+
				                    '<h4 class="weui-media-box__title">{{title}}</h4>'+
				                    '<p class="weui-media-box__desc">{{desc}}</p>'+
				                '</div>'+
				            '</a>',
				replace: true
			};
		})
		.directive('panelText', function(){
			return {
				scope: {
					image: '=',
					title: '=',
					desc: '='
				},
				require: '^?weuiPanel',
				restrict: 'E',
				template:   '<div class="weui-media-box weui-media-box_text">'+
				                '<h4 class="weui-media-box__title">{{title}}</h4>'+
				                '<p class="weui-media-box__desc">{{desc}}</p>'+
				                '<div ng-transclude></div>'+
				            '</div>',
				replace: true,
				transclude: true
			};
		})
		.directive('weuiPanelSm', function(){
			return {
				scope: {
					title: '@'
				},
				restrict: 'AE',
				template:   '<div class="weui-panel">'+
								'<div class="weui-panel__hd" ng-if="!!title">{{title}}</div>'+
								'<div class="weui-panel__bd">'+
									'<div class="weui-media-box weui-media-box_small-appmsg">'+
						                '<div class="weui-cells" ng-transclude>'+
						                '</div>'+
						            '</div>'+
								'</div>'+
							'</div>',
				replace: true,
				transclude: true
			};
		})
		.directive('panelAppmsgSm', function(){
			return {
				scope: {
					image: '=',
					title: '='
				},
				require: '^?weuiPanelSm',
				restrict: 'E',
				template:   '<a class="weui-cell weui-cell_access" href="javascript:;">'+
		                        '<div class="weui-cell__hd" ng-if="!!image"><img ng-src="{{image}}" alt="" style="width:20px;margin-right:5px;display:block"></div>'+
		                        '<div class="weui-cell__bd weui-cell_primary">'+
		                            '<p>{{title}}</p>'+
		                        '</div>'+
		                        '<span class="weui-cell__ft"></span>'+
		                    '</a>',
				replace: true
			};
		})
	
})(); 
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
/**
 * ngWeui v0.0.1
 */
(function() {

	var ngWeui = window.ngWeui || (window.ngWeui = {});

	var iPadAgent 	 = null != navigator.userAgent.match(/iPad/i),
		iPhoneAgent  = null != navigator.userAgent.match(/iPhone/i),
		AndroidAgent = null != navigator.userAgent.match(/Android/i),
		webOSAgent 	 = null != navigator.userAgent.match(/webOS/i),
		WechatAgent  = null != navigator.userAgent.match(/micromessenger/i)

	ngWeui.isIpad    = iPadAgent;
	ngWeui.isIPhone  = iPhoneAgent;
	ngWeui.isAndroid = AndroidAgent;
	ngWeui.isWebOS   = webOSAgent;
	ngWeui.isWechat  = WechatAgent;
	ngWeui.isMobile  = iPadAgent || iPhoneAgent || AndroidAgent || webOSAgent;
	ngWeui.isPC		 = !ngWeui.isMobile;

	ngWeui.version = 'v0.0.1';

	// ng-weui
	angular
		.module('ng-weui', [
			'ng-weui-actionsheet', 
			'ng-weui-dialog', 
			'ng-weui-fileUpload', 
			'ng-weui-gallery', 
			'ng-weui-msg', 
			'ng-weui-panel', 
			'ng-weui-toast', 
		])

})();