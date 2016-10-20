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
			'ng-weui-icon', 
			'ng-weui-loading', 
			'ng-weui-msg', 
			'ng-weui-panel', 
			'ng-weui-popup', 
			'ng-weui-templateLoader', 
			'ng-weui-toast', 
		])

})();