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