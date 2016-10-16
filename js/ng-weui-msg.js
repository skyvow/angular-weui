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