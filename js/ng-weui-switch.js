(function() {

	// ng-weui-switch	
	angular
		.module('ng-weui-switch', [])
		.directive('weuiSwitch', function(){
			return {
				restrict: 'E',
				replace: true,
				require: '?ngModel',
				transclude: true,
				template: 	'<div class="weui-cell weui-cell_switch">'+
				                '<div class="weui-cell__bd" ng-transclude></div>'+
				                '<div class="weui-cell__ft">'+
				                    '<input class="weui-switch" type="checkbox" name="switch">'+
				                '</div>'+
				            '</div>',
				compile: function(element, attr) {
					var input = element.find('input');
					
					angular.forEach({
						'name': attr.name,
						'ng-value': attr.ngValue,
						'ng-model': attr.ngModel,
						'ng-checked': attr.ngChecked,
						'ng-disabled': attr.ngDisabled,
						'ng-true-value': attr.ngTrueValue,
						'ng-false-value': attr.ngFalseValue,
						'ng-change': attr.ngChange,
						'ng-required': attr.ngRequired,
						'required': attr.required
					}, function(value, name) {
						if (angular.isDefined(value)) {
							input.attr(name, value);
						}
					});
				}
			};
		})
	
})(); 