(function() {

	// ng-weui-radio	
	angular
		.module('ng-weui-radio', [])
		.directive('weuiRadioGroup', function(){
			return {
				scope: {
					viewText: '@',
					viewMore: '&'
				},
				restrict: 'E',
				template:   '<div class="weui-cells weui-cells_radio">'+
								'<div class="weui-radio__bd" ng-transclude></div>'+
								'<div class="weui-radio__ft" ng-if="show">'+
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
		.directive('weuiRadio', function(){
			return {
				restrict: 'E',
				replace: true,
				require: '?ngModel',
				transclude: true,
				template: 	'<label class="weui-cell weui-check__label">'+
								'<div class="weui-cell__bd">'+
									'<p ng-transclude></p>'+
								'</div>'+
								'<div class="weui-cell__ft">'+
									'<input type="radio" class="weui-check" name="radio">'+
									'<span class="weui-icon-checked"></span>'+
								'</div>'+
							'</label>',

				compile: function(element, attr) {
					var input = element.find('input');
					
					angular.forEach({
						'name': attr.name,
						'value': attr.value,
						'disabled': attr.disabled,
						'ng-value': attr.ngValue,
						'ng-model': attr.ngModel,
						'ng-disabled': attr.ngDisabled,
						'ng-change': attr.ngChange,
						'ng-required': attr.ngRequired,
						'required': attr.required
					}, function(value, name) {
						if (angular.isDefined(value)) {
							input.attr(name, value);
						}
					});

					return function($scope, iElm, iAttrs, controller) {
						$scope.getValue = function() {
							return $scope.ngValue || iAttrs.value;
						};
					};
				}
			};
		})
	
})(); 