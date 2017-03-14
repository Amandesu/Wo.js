 import {W} from "./w"
 import {Wo} from "./wo"
 import {} from "./tool"
 W.extendProp({
 	client: function(options){
 		new ExchageHttpClient(options)  //未完成
 		
 	}

 });
 

var ExchageHttpClient = function (options) {
	this.request(options)
}
ExchageHttpClient.prototype.request = function(options){
	var requestDataType  = options.requestDataType || "JsonToString";
	var responseDataType = options.responseDataType || "StringToJson";
	var requestData = ExchageHttpClient.datas[requestDataType];
	var responseData = ExchageHttpClient.datas[responseDataType];
	var client = new Client();
	client.request({
		method                  : options.method.toUpperCase() || "GET",
		requestData    			: requestData ,
		responseData    		: responseData ,
		url            			: options.url,
		async					: options.async == undefined ? true : options.async,
		success					: options.success || function(){},
		error  					: options.error   || function(){},
		data                    : options.data
	});

};
ExchageHttpClient.prototype.response = function(){

}
ExchageHttpClient.datas = {};
ExchageHttpClient.register = function(options) {
	this.datas[options.type] = options;
}
//将对象转化为地址格式的字符串 {name:12, age 12}  => name=12&age=12
ExchageHttpClient.register({
	type: "ObjectToString",
	exchageData: function(data) {
		return urlObj(data)
	}
});
//将JOSN转化为JSON字符串
ExchageHttpClient.register({
	type: "JsonToString",
	exchageData: function(data) {
		return stringfiy(data);
	}
})
//将JOSN字符串转化为JSON格式
ExchageHttpClient.register({
	type: "StringToJson",
	exchageData: function(data) {
		return parse(data);
	}
})
function Client(){ 
	this.xhr = this.createXhr();
};

Client.prototype.request = function(options) {
	var xhr = this.xhr;
	var method = options.method;
	var responseData = options.responseData;
	if (method == "POST") {
		this.sendPostRequest(options)
	} else if (method == "GET") {
		this.sendGetRequest(options)
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var status = xhr.status;
			if (status >= 200 && status < 300) {
				var data = responseData.exchageData(xhr.responseText);
				options.success(data)
			}
		} else {
			options.error();
		}
	}

}
Client.prototype.sendGetRequest = function(options) {
	var url   = options.url.replace(/^(|\/)/, "/"),
		async = options.async,
		xhr   = this.xhr;
	xhr.open("GET", makeUrl(url, options.data), async);
	xhr.send()
}
Client.prototype.sendPostRequest = function(options) {
	var url   = options.url.replace(/^(|\/)/, "/"),
		async = options.async,
		xhr   = this.xhr,
		requestData = options.requestData,
		data        = requestData.exchageData(options.data);
	xhr.open("POST", url, async);
	xhr.send(data)
}
Client.prototype.createXhr = function() {
	return new XMLHttpRequest()
}
new ExchageHttpClient({
	method         : "post",
	//requestDataType: "JsonToString",
	url            : "index",
	data    : {
		coloumnId: "12",
		pageName :15
	},
	async: true,
	success: function(data){
		//alert(data)
	},
	error: function() {

	}

})

return W;