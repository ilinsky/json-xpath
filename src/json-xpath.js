/*
 * JSON XPath plugin (with full XPath 2.0 language support)
 *
 * Copyright (c) 2015 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

var oStaticContext	= new cStaticContext;
oStaticContext.defaultFunctionNamespace	= "http://www.w3.org/2005/xpath-functions";
oStaticContext.defaultElementNamespace	= null;

JSON.xpath	= function(sExpression, oContext, oScope) {
	var oExpression	= new cExpression(sExpression, oStaticContext),
		oXSScope	= {},
		oValue;
	if (typeof oScope == "object")
		for (var sKey in oScope)
			if (oScope.hasOwnProperty(sKey) && oScope[sKey] !== null) {
				oValue	= oScope[sKey];
				oXSScope[sKey]	= typeof oValue == "object" ? fJSON2Document(oValue) : cStaticContext.js2xs(oValue);
			};

	var oDynamicContext	= new cDynamicContext(oStaticContext, fJSON2Document(oContext), oXSScope, cJSONDOMAdapter),
		aReturn	= oExpression.evaluate(oDynamicContext),
		aValue	= [];
	for (var nIndex = 0, nLength = aReturn.length; nIndex < nLength; nIndex++) {
		oValue	= aReturn[nIndex];
		aValue.push(oValue instanceof cJSONNode ? oValue.nodeValue : cStaticContext.xs2js(oValue));
	};
	return aValue;
};

function fJSON2Document(oValue) {
	var oDocument	= new cJSONDocument(oValue);
	oDocument.nodeValue	= oValue;
	fJSON2Document_traverse(oValue, oDocument);
	return oDocument;
};

function fJSON2Document_traverse(oValue, oNode) {
	if (typeof oValue == "object") {
		for (var sKey in oValue) {
			if (cArray.isArray(oValue[sKey])) {
				for (var nIndex = 0, nLength = oValue[sKey].length; nIndex < nLength; nIndex++) {
					fJSON2Document_traverse(oValue[sKey][nIndex], fJSON2Document_addElement(sKey, oValue[sKey][nIndex], oNode));
				}
			}
/*			else
			if (typeof oValue[sKey] != "object") {
				fJSON2Document_addAttribute(sKey, oValue[sKey], oNode);
			}*/
			else {
				fJSON2Document_traverse(oValue[sKey], fJSON2Document_addElement(sKey, oValue[sKey], oNode));
			}
		}
	}
};

function fJSON2Document_addElement(sName, oValue, oParent) {
	var oElement	= new cJSONElement;
	oElement.nodeName	=
	oElement.localName	= sName;
	oElement.nodeValue	= oValue;
	oElement.parentNode	= oParent;
	oElement.ownerDocument	= oParent.nodeType == 9 ? oParent : oParent.ownerDocument;
	//
	oParent.childNodes.push(oElement);
	//
	var oLastChild	= oParent.lastChild;
	if (oLastChild) {
		oElement.previousSibling	= oLastChild;
		oLastChild.nextSibling	= oElement;
	}
	else
		oParent.firstChild	= oElement;
	oParent.lastChild	= oElement;
	//
	return oElement;
};
/*
function fJSON2Document_addAttribute(sName, oValue, oOwner) {
	var oAttr	= new cJSONAttr;
	oAttr.name	=
	oAttr.nodeName	=
	oAttr.localName	= sName;
	oAttr.value	= oValue;
	oAttr.nodeValue	= oValue;
	oAttr.ownerElement	= oOwner;
	oAttr.ownerDocument	= oOwner.nodeType == 9 ? oOwner : oOwner.ownerDocument;
	oOwner.attributes.push(oAttr);
};*/