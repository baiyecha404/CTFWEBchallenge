const url = require('url');


const appUrl="seoftw";
const renderUrl = "http://rendertron:3000/render" ;

function generateUrl(request){
	return url.format({
		protocol: request.protocol,
		host: appUrl,
		pathname: request.originalUrl
	});
}