function cJSONDocument() {
	this.childNodes	= [];
	this.attributes	= [];
};
cJSONDocument.prototype	= new cJSONNode;
cJSONDocument.prototype.nodeType	= 9;