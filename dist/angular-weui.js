(function() {

	// ng-weui-actionsheet	
	angular
		.module('ng-weui-actionsheet', [])
		.directive('weuiActionSheet', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-action-sheet-backdrop">'+
        						'<div class="weui-actionsheet">'+
					                '<div class="weui-actionsheet__menu">'+
					                	'<div class="weui-actionsheet__cell" ng-click="buttonClicked($index)" ng-repeat="b in buttons" ng-class="b.className" ng-bind="b.text"></div>'+
					                	'<div class="weui-actionsheet__cell destructive action-sheet-destructive" ng-if="destructiveText" ng-click="destructiveButtonClicked()" ng-bind="destructiveText"></div>'+
					                '</div>'+
					                '<div class="weui-actionsheet__action" ng-if="cancelText">'+
					                	'<div class="weui-actionsheet__cell" ng-click="cancel()" ng-bind="cancelText"></div>'+
					                '</div>'+
				                '</div>'+
			                '</div>',
			    link: function($scope, $element) {
					var keyUp = function(e) {
						if (e.which == 27) {
							$scope.cancel();
							$scope.$apply();
						}
					};

					var backdropClick = function(e) {
						if (e.target == $element[0]) {
							$scope.cancel();
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
		.provider('$weuiActionSheet', function () {
	        var defaults = this.defaults = {
				buttons: [],
				buttonClicked: angular.noop,
				cancelText: '取消',
				cancel: angular.noop,
				// destructiveText: '删除',
				// destructiveButtonClicked: angular.noop,
				cancelOnStateChange: true
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

					    var element = scope.element = $compile('<weui-action-sheet></weui-action-sheet>')(scope);
					    var sheetEl = $el(element[0].querySelector('.weui-actionsheet'));

					    var stateChangeListenDone = scope.cancelOnStateChange ? $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); }) : noop;

					    $body.append(element);

					    scope.showSheet = function(callback) {
					    	if (scope.removed) return;
					    	element[0].offsetWidth;
							element.addClass('active');
							sheetEl.addClass('weui-actionsheet_toggle');
					    }

					    scope.removeSheet = function(callback) {
					    	if (scope.removed) return;
					    	scope.removed = true;
							sheetEl.removeClass('weui-actionsheet_toggle');
							element.removeClass('active');
							stateChangeListenDone();
							element.on('transitionend', function() {
								element.remove();
								scope.cancel.$scope = element = null;
								(callback || noop)(opts.buttons);
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
	        		}
	        	}
	        	
	        	return publicMethods;
	        }]

	        this.setDefaults = function (newDefaults) {
	            angular.extend(defaults, newDefaults);
	        }
	    })
	
})(); 
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
(function() {

	// ng-weui-dialog	
	angular
		.module('ng-weui-dialog', [])
		.directive('weuiDialog', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-dialog-wrapper hidden">'+
						        '<div class="weui-dialog">'+
						            '<div class="weui-dialog__hd"><strong class="weui-dialog__title" ng-bind="title"></strong></div>'+
						            '<div class="weui-dialog__bd" ng-bind="text"></div>'+
						            '<div class="weui-dialog__ft">'+
						                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" ng-if="cancelText" ng-click="cancel()" ng-bind="cancelText"></a>'+
						                '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" ng-click="confirm()" ng-bind="confirmText"></a>'+
						            '</div>'+
						       '</div>'+
						    '</div>',
			    link: function($scope, $element) {
					var keyUp = function(e) {
						if (e.which == 27) {
							$scope.cancel();
							$scope.$apply();
						}
					};

					$scope.$on('$destroy', function() {
						$element.remove();
						$document.unbind('keyup', keyUp);
					});

					$document.bind('keyup', keyUp);
			    }
			}
		}])
		.provider('$weuiDialog', function () {
	        var defaults = this.defaults = {
	            className: undefined,
	            title: undefined,
	            text: undefined,
	            bodyClassName: 'ng-weui-dialog-open',
	            cancelText: '取消',
	            cancel: angular.noop,
	            confirmText: '确定',
	            confirm: angular.noop
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
	        		open: function(opts) {
	        			var scope = $rootScope.$new(true);

						extend(scope, copy(defaults), opts || {});

					    var element = scope.element = $compile('<weui-dialog></weui-dialog>')(scope);

					    $body.addClass(scope.bodyClassName).append(element);

					    scope.showDialog = function(callback) {
					    	if (scope.removed) return;
					    	$weuiBackdrop.retain();
					    	var $backdrop = $weuiBackdrop.getElement()
					    	$backdrop.addClass('backdrop-dialog');
					    	$backdrop.off().on('click', function(e) {
					    		if ($backdrop.hasClass('backdrop-dialog')) {
					    			scope.cancel()
					    		}
					    	})
							element.addClass('visible');
					    	element[0].offsetWidth;
							element.addClass('active');
					    }

					    scope.removeDialog = function(callback) {
					    	if (scope.removed) return;
					    	scope.removed = true;
					    	$weuiBackdrop.release()
					    	$weuiBackdrop.getElement().removeClass('backdrop-dialog')
							element.removeClass('active');
							element.on('transitionend', function() {
								element.remove();
								scope.$destroy();
								scope.cancel.$scope = element = null;
								(callback || noop)();
							})
						}

						scope.cancel = function() {
							scope.removeDialog(opts.cancel);
						}

						scope.confirm = function() {
							scope.removeDialog(opts.confirm);
						}

						scope.showDialog();
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

	// ng-weui-fileUpload	
	angular
		.module('ng-weui-fileUpload', [])
		.factory('$weuiFileReader', ['$q', function ($q) {
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
		.provider('$weuiFileOptimization', function () {
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
		.directive('weuiFileModel', ['$parse', '$compile', function($parse, $compile){
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
			            //清空文件上传域
			            _replaceNode(element);
			        });
			        function _replaceNode(input) {
			        	var clone = $compile(input.clone().val(''))(scope);
			        	input.after(clone);
		            	input.remove();
			        }
			    }
			};
		}])
	
})(); 
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
		.provider('$weuiGallery', function () {
	        var defaults = this.defaults = {
	        	url: undefined,
	        	cancel: angular.noop,
	        	delete: angular.noop
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
								(callback || noop)(opts.url);
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

	// ng-weui-loading	
	angular
		.module('ng-weui-loading', [])
		.directive('weuiLoading', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-loading-wrapper hidden">'+
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
				noBackdrop: true,
				hideOnStateChange: false
	        }

	        this.$get = ['$document', '$weuiTemplateLoader', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$weuiBackdrop',
            function ($document, $weuiTemplateLoader, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $weuiBackdrop) {
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

									if (!self.isShown) {
										self.hasBackdrop = !options.noBackdrop;
										if (self.hasBackdrop) {
											$weuiBackdrop.retain();
											$weuiBackdrop.getElement().addClass('backdrop-loading');
										}
									}

									templatePromise.then(function(html) {
										if (html) {
											var loading = $el(self.element[0].querySelector('.weui-toast__content'));
											loading.html(html);
											$compile(loading.contents())(self.scope);
										}

										if (self.isShown) {
											self.element.addClass('visible');
											self.element[0].offsetWidth;
											self.element.addClass('active');
											$body.addClass('ng-weui-loading-active');
										}
									});

									self.isShown = true;
								};

								self.hide = function() {
									if (self.isShown) {
										if (self.hasBackdrop) {
											$weuiBackdrop.release();
											$weuiBackdrop.getElement().removeClass('backdrop-loading');
										}
										self.element.removeClass('active');
										$body.removeClass('ng-weui-loading-active');
										self.element.removeClass('visible');
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
						            '<h2 class="weui-msg__title" ng-bind="title"></h2>'+
						            '<p class="weui-msg__desc" ng-bind="desc"></p>'+
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
								'<div class="weui-panel__hd" ng-if="!!title" ng-bind="title"></div>'+
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
				                    '<h4 class="weui-media-box__title" ng-bind="title"></h4>'+
				                    '<p class="weui-media-box__desc" ng-bind="desc"></p>'+
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
				                '<h4 class="weui-media-box__title" ng-bind="title"></h4>'+
				                '<p class="weui-media-box__desc" ng-bind="desc"></p>'+
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
								'<div class="weui-panel__hd" ng-if="!!title" ng-bind="title"></div>'+
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
		                            '<p ng-bind="title"></p>'+
		                        '</div>'+
		                        '<span class="weui-cell__ft"></span>'+
		                    '</a>',
				replace: true
			};
		})
	
})(); 
(function() {

	// ng-weui-popup	
	angular
		.module('ng-weui-popup', [])
		.directive('weuiPopup', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-dialog-wrapper hidden" ng-class="className">'+
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

					$scope.$on('$destroy', function() {
						$element.remove();
						$document.unbind('keyup', keyUp);
					});

					$document.bind('keyup', keyUp);
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

	        this.$get = ['$q', '$timeout', '$rootScope', '$compile', '$weuiTemplateLoader', '$weuiBackdrop', 
            function ($q, $timeout, $rootScope, $compile, $weuiTemplateLoader, $weuiBackdrop) {
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

				var privateMethods = {
					focusInput: function(element) {
						var focusOn = element[0].querySelector('[autofocus]');
						if (focusOn) {
							focusOn.focus();
						}
					}
				}

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
						self.element.addClass('visible active');
						privateMethods.focusInput(self.element);
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
						$weuiBackdrop.retain();
				    	var $backdrop = $weuiBackdrop.getElement();
				    	$backdrop.addClass('backdrop-popup');
				    	$backdrop.off().on('click', function(e) {
				    		if ($backdrop.hasClass('backdrop-popup')) {
				    			popup.responseDeferred.promise.close();
				    		}
				    	})
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
								$weuiBackdrop.release();
								$weuiBackdrop.getElement().removeClass('backdrop-popup');

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
(function() {

	// ng-weui-templateLoader	
	angular
		.module('ng-weui-templateLoader', [])
		.factory('$weuiTemplateLoader', ['$compile', '$controller', '$http', '$q', '$rootScope', '$templateCache', 
		function($compile, $controller, $http, $q, $rootScope, $templateCache) {
			return {
				load   : fetchTemplate,
				compile: loadAndCompile
			};

			function fetchTemplate(url) {
				return $http.get(url, {cache: $templateCache})
				.then(function(response) {
					return response.data && response.data.trim();
				});
			}

			function loadAndCompile(options) {
				options = angular.extend({
					template   : '',
					templateUrl: '',
					scope      : null,
					controller : null,
					locals     : {},
					appendTo   : null
				}, options || {});

				var templatePromise = options.templateUrl ? this.load(options.templateUrl) : $q.when(options.template);

				return templatePromise.then(function(template) {
					var controller;
					var scope = options.scope || $rootScope.$new();

					//Incase template doesn't have just one root element, do this
					var element = angular.element('<div>').html(template).contents();

					if (options.controller) {
						controller = $controller(
							options.controller,
							angular.extend(options.locals, {
								$scope: scope
							})
						);
						element.children().data('$ngControllerController', controller);
					}

					if (options.appendTo) {
						angular.element(options.appendTo).append(element);
					}

					$compile(element)(scope);

					return {
						element: element,
						scope  : scope
					};
				});
			}
		}])
	
})(); 
(function() {

	// ng-weui-toast	
	angular
		.module('ng-weui-toast', [])
		.directive('weuiToast', ['$document', function($document) {
			 return {
			    restrict: 'E',
			    scope: true,
			    replace: true,
			    template: 	'<div class="ng-weui-toast-wrapper hidden">'+
						        '<div class="weui-toast">'+
						            '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'+
						            '<p class="weui-toast__content" ng-bind="text"></p>'+
						        '</div>'+
						    '</div>',
			    link: function($scope, $element) {
			    }
			}
		}])
		.provider('$weuiToast', function () {
	        var defaults = this.defaults = {
	        	type: 'default',
	        	timer: 1500,
	        	text: '已完成',
	        	noBackdrop: true,
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

					    var element = scope.element = $compile('<weui-toast></weui-toast>')(scope);

					    if(scope.type == 'forbidden') {
	        				element.addClass('ng-weui-toast-forbidden');
	        			}

					    $body.append(element);

					    if (!scope.noBackdrop) {
							$weuiBackdrop.retain();
							$weuiBackdrop.getElement().addClass('backdrop-toast');
						}

					    element.addClass('visible');
						element[0].offsetWidth;
						element.addClass('active');

					    scope.remove = function(callback) {
					    	$timeout(function() {
					    		if (!scope.noBackdrop) {
									$weuiBackdrop.release();
									$weuiBackdrop.getElement().removeClass('backdrop-toast');
								}

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
			'ng-weui-backdrop', 
			'ng-weui-dialog', 
			'ng-weui-fileUpload', 
			'ng-weui-gallery', 
			'ng-weui-loading', 
			'ng-weui-msg', 
			'ng-weui-panel', 
			'ng-weui-popup', 
			'ng-weui-templateLoader', 
			'ng-weui-toast', 
		])

})();