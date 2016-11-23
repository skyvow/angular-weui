(function() {

	// ng-weui-checkbox	
	angular
		.module('ng-weui-checkbox', [])
		.directive('weuiCheckboxGroup', function(){
			return {
				scope: {
					viewText: '@',
					viewMore: '&'
				},
				restrict: 'E',
				template:   '<div class="weui-cells weui-cells_checkbox">'+
								'<div class="weui-checkbox__bd" ng-transclude></div>'+
								'<div class="weui-checkbox__ft" ng-if="show">'+
									'<a href="javascript:void(0);" class="weui-cell weui-cell_link" ng-click="viewMore()">'+
						                '<div class="weui-cell__bd" ng-bind="viewText"></div>'+
						            '</a>'+
								'</div>'+
							'</div>',
				replace: true,
				transclude: true,
				link: function($scope, iElm, iAttrs, controller) {
					$scope.viewText = $scope.viewText || '添加更多';
					$scope.show = !!iAttrs.viewMore && angular.isFunction($scope.viewMore);
				}
			};
		})
		.directive('weuiCheckbox', function(){
			return {
				restrict: 'E',
				replace: true,
				require: '?ngModel',
				transclude: true,
				template: 	'<label class="weui-cell weui-check__label">'+
								'<div class="weui-cell__hd">'+
				                    '<input type="checkbox" name="checkbox" class="weui-check">'+
				                    '<i class="weui-icon-checked"></i>'+
				                '</div>'+
				                '<div class="weui-cell__bd">'+
				                    '<p ng-transclude></p>'+
				                '</div>'+
							'</label>',

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