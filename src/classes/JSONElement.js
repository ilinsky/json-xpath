function cJSONElement() {
	this.childNodes	= [];
	this.attributes	= [];
};
cJSONElement.prototype	= new cJSONNode;
cJSONElement.prototype.nodeType	= 1;
cJSONElement.prototype.attributes	= null;