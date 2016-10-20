(function() {

	// ng-weui-icon	
	angular
		.module('ng-weui-icon', [])
		.directive('weuiIcon', function(){
			return {
				restrict: 'E',
				template: '<i></i>',
				replace: true,
				link: function($scope, $element, $attrs, ctrl) {
					var iconName = $attrs.icon || 'success';
					$element.addClass('weui-icon-' + iconName);
				}
  			};
		})
	
})(); 