var cJSONDOMAdapter	= new cDOMAdapter;
cJSONDOMAdapter.getProperty	= function(oNode, sName) {
	if (sName == "textContent")
		if (typeof oNode.nodeValue == "string")
			return oNode.nodeValue;
	return oNode[sName];
};
cJSONDOMAdapter.compareDocumentPosition	= function(oNode, oChild) {
	// Otherwise run JS fallback
	if (oChild == oNode)
		return 0;

	//
	var oAttr1	= null,
		oAttr2	= null,
		aAttributes,
		oAttr, oElement, nIndex, nLength;
	if (oNode.nodeType == 2 /* cNode.ATTRIBUTE_NODE */) {
		oAttr1	= oNode;
		oNode	= this.getProperty(oAttr1, "ownerElement");
	}
	if (oChild.nodeType == 2 /* cNode.ATTRIBUTE_NODE */) {
		oAttr2	= oChild;
		oChild	= this.getProperty(oAttr2, "ownerElement");
	}

	// Compare attributes from same element
	if (oAttr1 && oAttr2 && oNode && oNode == oChild) {
		for (nIndex = 0, aAttributes = this.getProperty(oNode, "attributes"), nLength = aAttributes.length; nIndex < nLength; nIndex++) {
			oAttr	= aAttributes[nIndex];
			if (oAttr == oAttr1)
				return 32 /* cNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC */ | 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */;
			if (oAttr == oAttr2)
				return 32 /* cNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC */ | 2 /* cNode.DOCUMENT_POSITION_PRECEDING */;
		}
	}

	//
	var aChain1	= [], nLength1, oNode1,
		aChain2	= [], nLength2, oNode2;
	//
	if (oAttr1)
		aChain1.push(oAttr1);
	for (oElement = oNode; oElement; oElement = oElement.parentNode)
		aChain1.push(oElement);
	if (oAttr2)
		aChain2.push(oAttr2);
	for (oElement = oChild; oElement; oElement = oElement.parentNode)
		aChain2.push(oElement);
	// If nodes are from different documents or if they do not have common top, they are disconnected
	if (((oNode.ownerDocument || oNode) != (oChild.ownerDocument || oChild)) || (aChain1[aChain1.length - 1] != aChain2[aChain2.length - 1]))
		return 32 /* cNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC */ | 1 /* cNode.DOCUMENT_POSITION_DISCONNECTED */;
	//
	for (nIndex = Math.min(nLength1 = aChain1.length, nLength2 = aChain2.length); nIndex; --nIndex)
		if ((oNode1 = aChain1[--nLength1]) != (oNode2 = aChain2[--nLength2])) {
			//
			if (oNode1.nodeType == 2 /* cNode.ATTRIBUTE_NODE */)
				return 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */;
			if (oNode2.nodeType == 2 /* cNode.ATTRIBUTE_NODE */)
				return 2 /* cNode.DOCUMENT_POSITION_PRECEDING */;
			//
			if (!oNode2.nextSibling)
				return 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */;
			if (!oNode1.nextSibling)
				return 2 /* cNode.DOCUMENT_POSITION_PRECEDING */;
			for (oElement = oNode2.previousSibling; oElement; oElement = oElement.previousSibling)
				if (oElement == oNode1)
					return 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */;
			return 2 /* cNode.DOCUMENT_POSITION_PRECEDING */;
		}
	//
	return nLength1 < nLength2 ? 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */ | 16 /* cNode.DOCUMENT_POSITION_CONTAINED_BY */ : 2 /* cNode.DOCUMENT_POSITION_PRECEDING */ | 8 /* cNode.DOCUMENT_POSITION_CONTAINS */;
};