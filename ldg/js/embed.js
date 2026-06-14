//
// Object Embed - http://www.leveltendesign.com/tools/click-to-activate.php 
// Further Reading - http://www.leveltendesign.com/blog/web-development/by-chrisr/click-to-activate/
//

function embedObject() {
	document.write('<APPLET archive=\"DuriusWaterPic.jar\" WIDTH=\"440\" HEIGHT=\"60\" ALIGN=\"MIDDLE\" CODE=\"DuriusWaterPic.class\">' +
	'	<PARAM NAME=\"cabbase\" VALUE=\"DuriusWaterPic.cab\">' +
	'	<PARAM NAME=\"image\" VALUE=\"images/banner01_reflect.jpg\">' +
	'	<PARAM NAME=\"dim\" VALUE=\"5\">' +
	'	<PARAM NAME=\"noise\" VALUE=\"0\">' +
	'	<PARAM NAME=\"mouse\" VALUE=\"9\">' +
	'	<PARAM NAME=\"timer\" VALUE=\"0\">' +
	'	<PARAM NAME=\"bg\" VALUE=\"ffffff\">' +
	'	<PARAM NAME=\"reg\" VALUE=\"22454732\">' +
	'</APPLET>');

}

// execute!
embedObject();
