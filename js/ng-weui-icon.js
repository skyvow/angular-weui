(function() {

	// ng-weui-icon	
	angular
		.module('ng-weui-icon', [])
		.directive('weuiIcon', function(){
			return {
				restrict: 'E',
				template: '<i ng-style="iconStyle"></i>',
				replace: true,
				link: function($scope, $element, $attrs, ctrl) {
					var iconCls = 'weui-icon-' + ($attrs.type || 'success');
					var iconStyle = {}
					if($attrs.size) {
						iconStyle['font-size'] = ($attrs.size || 23) + 'px';
					}
					if($attrs.color) {
						iconStyle['color'] = $attrs.color;
					}
					$element.addClass(iconCls).css(iconStyle);
				}
  			};
		})
	
})(); 