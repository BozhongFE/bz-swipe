export function addStyleToHead(cssString) {
  var doc = document;
  var style = doc.createElement("style");
  style.setAttribute("type", "text/css");
  if (style.styleSheet) { // IE
    style.styleSheet.cssText = cssString;
  } else { // w3c
    var cssText = doc.createTextNode(cssString);
    style.appendChild(cssText);
  }
  var heads = doc.getElementsByTagName("head");
  if (heads.length)
    heads[0].appendChild(style);
  else
    doc.documentElement.appendChild(style);
}
