const path = require('path');

export default class DocsApi {

	index(req, res) {
		res.sendFile( path.join( __dirname + './index.html' ) );
	}   

}