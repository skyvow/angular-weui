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