/* -- Adobe GoLive JavaScript Library */
/* -- Global Functions */
CSStateArray = new Object;
CSCookieArray = new Object;
CSCookieValArray = new Object;
function CSWriteCookie(action) {
	var name   = "DFT" + action[1];
	var hrs    = action[2];
	var path   = action[3];
	var domain = action[4];
	var secure = action[5];	
	var exp    = new Date((new Date()).getTime() + hrs * 3600000);	
	var cookieVal = "";
	for(var prop in CSCookieArray) {
		if(("DFT" + CSCookieArray[prop]) == name) {
			if(cookieVal != "") cookieVal += "&";
			cookieVal += prop + ":" + escape(CSStateArray[prop]);
		}
	}
	if(hrs != 0)
		cookieVal += "; expires=" + exp.toGMTString();
	if(path != "")
		cookieVal += "; path=" + path;
	if(domain != "")
		cookieVal += "; domain=" + domain;
	if(secure == true)
		cookieVal += "; secure";
	document.cookie = name + '=' + cookieVal;
}
function CSReadCookie(action) {
	var name    = "DFT" + action[1];
	var cookies = document.cookie;
	if(cookies == "") return;
	var start = cookies.indexOf(name);
	if(start == -1) return;
	start += name.length + 1;
	var end = cookies.indexOf(";", start);
	if(end == -1) end = cookies.length;
	var cookieVal = cookies.substring(start, end);
	var arr = cookieVal.split('&');
	for(var i = 0; i < arr.length; i++) {
		var a = arr[i].split(':');
		CSStateArray[a[0]] = unescape(a[1]);
	}	
}
function CSDefineState(action) {
	CSCookieArray[action[1]] = action[3]; 
}
function CSSetState(action) {
	CSStateArray[action[1]] = action[2];
}
function CSInitState(action) {
	if(typeof(CSStateArray[action[1]]) == "undefined")
		CSStateArray[action[1]] = action[2];
}
function CSCheckState(action) {
	var obj1 = CSStateArray[action[1]];
	var obj2 = action[2];
	if(typeof(obj1) == "object") {
		for(var i=0;i<obj1.length;i++) {
			if(obj1[i] != obj2[i])
				return false;
			}
		return true;
		}
	var res;
	var op = action[3];
		     if(op == "==") res = (CSStateArray[action[1]] == action[2]);	
		else if(op == "!=") res = (CSStateArray[action[1]] != action[2]);	
		else if(op == ">" ) res = (CSStateArray[action[1]] >  action[2]);	
		else if(op == ">=") res = (CSStateArray[action[1]] >= action[2]);	
		else if(op == "<" ) res = (CSStateArray[action[1]] <  action[2]);	
		else if(op == "<=") res = (CSStateArray[action[1]] <= action[2]);	
	return res;
}
CSAg = window.navigator.userAgent; CSBVers = parseInt(CSAg.charAt(CSAg.indexOf("/")+1),10);
CSIsW3CDOM = ((document.getElementById) && !(IsIE()&&CSBVers<6)) ? true : false;
function IsIE() { return CSAg.indexOf("MSIE") > 0;}
function CSIEStyl(s) { return document.all.tags("div")[s].style; }
function CSNSStyl(s) { if (CSIsW3CDOM) return document.getElementById(s).style; else return CSFindElement(s,0);  }
CSIImg=false;
function CSInitImgID() {if (!CSIImg && document.images) { for (var i=0; i<document.images.length; i++) { if (!document.images[i].id) document.images[i].id=document.images[i].name; } CSIImg = true;}}
function CSFindElement(n,ly) { if (CSBVers<4) return document[n];
	if (CSIsW3CDOM) {CSInitImgID();return(document.getElementById(n));}
	var curDoc = ly?ly.document:document; var elem = curDoc[n];
	if (!elem) {for (var i=0;i<curDoc.layers.length;i++) {elem=CSFindElement(n,curDoc.layers[i]); if (elem) return elem; }}
	return elem;
}
function CSGetImage(n) {if(document.images) {return ((!IsIE()&&CSBVers<5)?CSFindElement(n,0):document.images[n]);} else {return null;}}
CSDInit=false;
function CSIDOM() { if (CSDInit)return; CSDInit=true; if(document.getElementsByTagName) {var n = document.getElementsByTagName('DIV'); for (var i=0;i<n.length;i++) {CSICSS2Prop(n[i].id);}}}
function CSICSS2Prop(id) { var n = document.getElementsByTagName('STYLE');for (var i=0;i<n.length;i++) { var cn = n[i].childNodes; for (var j=0;j<cn.length;j++) { CSSetCSS2Props(CSFetchStyle(cn[j].data, id),id); }}}
function CSFetchStyle(sc, id) {
	var s=sc; while(s.indexOf("#")!=-1) { s=s.substring(s.indexOf("#")+1,sc.length); if (s.substring(0,s.indexOf("{")).toUpperCase().indexOf(id.toUpperCase())!=-1) return(s.substring(s.indexOf("{")+1,s.indexOf("}")));}
	return "";
}
function CSGetStyleAttrValue (si, id) {
	var s=si.toUpperCase();
	var myID=id.toUpperCase()+":";
	var id1=s.indexOf(myID);
	if (id1==-1) return "";
	s=s.substring(id1+myID.length+1,si.length);
	var id2=s.indexOf(";");
	return ((id2==-1)?s:s.substring(0,id2));
}
function CSSetCSS2Props(si, id) {
	var el=document.getElementById(id);
	if (el==null) return;
	var style=document.getElementById(id).style;
	if (style) {
		if (style.left=="") style.left=CSGetStyleAttrValue(si,"left");
		if (style.top=="") style.top=CSGetStyleAttrValue(si,"top");
		if (style.width=="") style.width=CSGetStyleAttrValue(si,"width");
		if (style.height=="") style.height=CSGetStyleAttrValue(si,"height");
		if (style.visibility=="") style.visibility=CSGetStyleAttrValue(si,"visibility");
		if (style.zIndex=="") style.zIndex=CSGetStyleAttrValue(si,"z-index");
	}
}
function CSSetStylePos(s,d,p) {
	if (CSIsW3CDOM)d==0?document.getElementById(s).style.left=p+"px":document.getElementById(s).style.top=p+"px";
	else if(IsIE())(d==0)?CSIEStyl(s).posLeft=p:CSIEStyl(s).posTop=p;
	else (d==0)?CSNSStyl(s).left=p:CSNSStyl(s).top=p;
}
function CSGetStylePos(s,d) {
	if (CSIsW3CDOM){CSIDOM();return parseInt((d==0)?document.getElementById(s).style.left:document.getElementById(s).style.top);}
	else if (IsIE()) {CSIEWinInit();return(d==0)?CSIEStyl(s).posLeft:CSIEStyl(s).posTop;}
	else {return (d==0)?CSNSStyl(s).left:CSNSStyl(s).top;}
}
CSIEWInit=false;
function CSIEWinInit() { if(CSIEWInit==true) return; else CSIEWInit=true; if (IsIE()&&(CSAg.indexOf("Win")!=-1)&&CSBVers==4) { var i=0; var lyr=document.all.tags("div")[i++]; while(lyr) {lyr.style.posLeft=lyr.offsetLeft; lyr.style.posTop=lyr.offsetTop; lyr=document.all.tags("div")[i++];}}}
CSLoopIsRunning = false; CSFctArray = new Array; CSTimeoutID = null;
function CSLoop() {	
	CSLoopIsRunning = false;
	for (i=0;i<CSFctArray.length;i++) {
		var curFct = CSFctArray[i];
		if (curFct)	{
			if (curFct.DoFunction(curFct)) { CSLoopIsRunning = true; curFct.counter++; }
			else CSFctArray[i] = 0;
		}
	}
	if (CSLoopIsRunning) CSTimeoutID = setTimeout("CSLoop()", 1);
}
function CSStartFunction(fct,data) {
	if (!CSLoopIsRunning) { CSFctArray = 0; CSFctArray = new Array; }
	var fctInfo = new Object;
	fctInfo.DoFunction = fct; fctInfo.counter = 0; fctInfo.data = data;
	CSFctArray[CSFctArray.length] = fctInfo; 
	if (!CSLoopIsRunning) CSLoop();
}
function CSStopFunction(sceneName) {
	var i;
	for (i=0;i<CSFctArray.length;i++) {
		var curFct = CSFctArray[i];
		if (curFct){ if (curFct.data.name == sceneName){ CSFctArray[i] = 0; return; } }
	}
}
function CSStopComplete() {
	if (CSTimeoutID == null) return;
	clearTimeout (CSTimeoutID); CSLoopIsRunning = false; CSTimeoutID = null;
}
function CSMoveLoop(fInf) {
	var ticks = 60 * (((new Date()).getTime()) - fInf.data.startTime)/1000;
	var f = ticks/fInf.data.ticks;
	if (f < 1) { CSSetStylePos(fInf.data.layer,0,fInf.data.start[0] * (1-f) + fInf.data.end[0] * f);
		CSSetStylePos(fInf.data.layer,1,fInf.data.start[1] * (1-f) + fInf.data.end[1] * f); return true; }
	else { CSSetStylePos(fInf.data.layer,0,fInf.data.end[0]);
		CSSetStylePos(fInf.data.layer,1,fInf.data.end[1]); }
	return false;
}
function CSSlideObj (layer,start,end,ticks,startTime) {
	this.layer=layer;this.start=start;this.end=end;this.ticks=ticks;this.startTime=startTime;
}
function CSSlideLayer(l,pos,anim,ticks) {
	var x = pos[0]; var y = pos[1];
	if (l == '') return;
	if (ticks < 0) ticks = 0;
	if (!anim) { CSSetStylePos(l,0,x); CSSetStylePos(l,1,y); }
	else {  var fctData = new CSSlideObj(l,new Array(CSGetStylePos(l,0),CSGetStylePos(l,1)),new Array(x,y),ticks,(new Date()).getTime()); CSStartFunction(CSMoveLoop,fctData); }
}
function ROFindEmbed (name) {
	/* only for netscape */
	if(CSIsW3CDOM) {
		var emb=null;
		for(j=0; j<document.embeds.length; j++) {
			if(document.embeds[j].name==name) {
				emb=document.embeds[j]; break;
			}
		}
		return emb;
	}
	else
		return CSFindElement(name);
}
function ROUnpackVersionNumber(n) {
   return "" + (n >> 28) + "." +
   ((n & 0xFF00000) >> 20) + "." + 
   ((n & 0xFF000) >> 12) + "." + 
   ( n & 0xFFF);
}
function CSSetStyleVis(s,v) {
	if (CSIsW3CDOM){CSIDOM();document.getElementById(s).style.visibility=(v==0)?"hidden":"visible";}
	else if(IsIE())CSIEStyl(s).visibility=(v==0)?"hidden":"visible";
	else CSNSStyl(s).visibility=(v==0)?'hide':'show';
}
function CSGetStyleVis(s) {
	if (CSIsW3CDOM) {CSIDOM();return(document.getElementById(s).style.visibility=="hidden")?0:1;}
	else if(IsIE())return(CSIEStyl(s).visibility=="hidden")?0:1;
	else return(CSNSStyl(s).visibility=='hide')?0:1;
}
ROOnPLCArray=new Array();
function RPOnPositionLengthChange (position, length) {
	for(var i=0;i<ROOnPLCArray.length;i++) {
		var obj=ROOnPLCArray[i];
		if(typeof(obj)=="object") { 
			if(obj.time==position) {
				if(obj.type=="navigate") {
					window.parent.external.HandleAction("NavigateToURL("+obj.url+","+obj.target+")");
					ROOnPLCArray[i]=0;
				}
				else if(obj.type=="color") {
					window.parent.external.SetVideoBackgroundColor(obj.color);
					ROOnPLCArray[i]=0;
				}
			}
		}
	}
}
function CSGetLayerClip (el) {
	CSIDOM();
	if (el.isIE) return (new CSRect(0,0,el.offsetWidth,el.offsetHeight));
	else if (CSBVers>=5) return (new CSRect(0,0,parseInt(el.style.width),parseInt(el.style.height)));
	else return (new CSRect(el.clip.left,el.clip.top,el.clip.width,el.clip.height));
}
function CSSetLayerClip (el,clipRect) {
    var l,t,r,b;
    l=clipRect.left; t=clipRect.top; r=l+clipRect.width; b=t+clipRect.height;
    if(el.isIE) { el.style.clip = "rect("+ t + " " + r + " " + b + " " + l + ")"; }
    else if (CSBVers>=5) el.style.clip = "rect("+ t + "px, " + r + "px, " + b + "px, " + l + "px)";
    else { el.clip.left=l; el.clip.top=t; el.clip.width=clipRect.width; el.clip.height=clipRect.height; }
	CSSetStyleVis(el.layer);
}
function CSRect (left,top,width,height) {
this.left=left; this.top=top; this.width=width; this.height=height;
}
function CSCreateTransElement (layer, steps) {
	var el;
	if (IsIE()) el=document.all.tags("div")[layer];
	else if (CSBVers>=5) el=document.getElementById(layer);
	else el=CSNSStyl(layer);
	if (el==null) return null;
	if (el.locked && (el.locked == true)) return null;
	el.isIE=IsIE();
	el.clipRect=CSGetLayerClip(el);
	if (el.clipRect==null) return null;
	el.maxValue=steps;
	if (el.maxValue<=0) el.maxValue=30;
	el.modus=""; el.layer=layer;
	el.width=el.clipRect.width; el.height=el.clipRect.height;
	el.locked = true;
	return el;
}
function CSDisposeTransElement (el) { el.locked = false; }
function CSScriptInit() {
if(typeof(skipPage) != "undefined") { if(skipPage) return; }
idxArray = new Array;
for(var i=0;i<CSInit.length;i++)
	idxArray[i] = i;
CSAction2(CSInit, idxArray);
}
function CSScriptExit() {
idxArray = new Array;
for(var i=0;i<CSExit.length;i++)
	idxArray[i] = i;
CSAction2(CSExit, idxArray);
}
CSInit = new Array;
CSExit = new Array;
CSStopExecution=false;
function CSAction(array) {return CSAction2(CSAct, array);}
function CSAction2(fct, array) { 
	var result;
	for (var i=0;i<array.length;i++) {
		if(CSStopExecution) return false; 
		var aa = fct[array[i]];
		if (aa == null) return false;
		var ta = new Array;
		for(var j=1;j<aa.length;j++) {
			if((aa[j]!=null)&&(typeof(aa[j])=="object")&&(aa[j].length==2)){
				if(aa[j][0]=="VAR"){ta[j]=CSStateArray[aa[j][1]];}
				else{if(aa[j][0]=="ACT"){ta[j]=CSAction(new Array(new String(aa[j][1])));}
				else ta[j]=aa[j];}
			} else ta[j]=aa[j];
		}			
		result=aa[0](ta);
	}
	return result;
}
CSAct = new Object;
CSIm=new Object();
function CSIShow(n,i) {
	if (document.images) {
		if (CSIm[n]) {
			var img=CSGetImage(n);
			if (img&&typeof(CSIm[n][i].src)!="undefined") {img.src=CSIm[n][i].src;}
			if(i!=0) self.status=CSIm[n][3]; else self.status=" ";
			return true;
		}
	}
	return false;
}
function CSILoad(action) {
	im=action[1];
	if (document.images) {
		CSIm[im]=new Object();
		for (var i=2;i<5;i++) {
			if (action[i]!='') {CSIm[im][i-2]=new Image(); CSIm[im][i-2].src=action[i];}
			else CSIm[im][i-2]=0;
		}
		CSIm[im][3] = action[5];
	}
}
function newImage(arg) {
	if (document.images) {
		rslt = new Image();
		rslt.src = arg;
		return rslt;
	}
}
userAgent = window.navigator.userAgent;
browserVers = parseInt(userAgent.charAt(userAgent.indexOf("/")+1),10);
mustInitImg = true;
function initImgID() {var di = document.images; if (mustInitImg && di) { for (var i=0; i<di.length; i++) { if (!di[i].id) di[i].id=di[i].name; } mustInitImg = false;}}
function findElement(n,ly) {
	var d = document;
	if (browserVers < 4)		return d[n];
	if ((browserVers >= 6) && (d.getElementById)) {initImgID; return(d.getElementById(n))}; 
	var cd = ly ? ly.document : d;
	var elem = cd[n];
	if (!elem) {
		for (var i=0;i<cd.layers.length;i++) {
			elem = findElement(n,cd.layers[i]);
			if (elem) return elem;
		}
	}
	return elem;
}
function changeImagesArray(array) {
	if (preloadFlag == true) {
		var d = document; var img;
		for (i=0;i<array.length;i+=2) {
			img = null; var n = array[i];
			if (d.images) {
				if (d.layers) {img = findElement(n,0);}
				else {img = d.images[n];}
			}
			if (!img && d.getElementById) {img = d.getElementById(n);}
			if (!img && d.getElementsByName) {
				var elms = d.getElementsByName(n);
				if (elms) {
					for (j=0;j<elms.length;j++) {
						if (elms[j].src) {img = elms[j]; break;}
					}
				}
			}
			if (img) {img.src = array[i+1];}
		}
	}
}
function changeImages() {
	changeImagesArray(changeImages.arguments);
}
function toggleImages() {
	for (var i=0; i<toggleImages.arguments.length; i+=2) {
		if (selected == toggleImages.arguments[i])
			changeImagesArray(toggleImages.arguments[i+1]);
	}
}
function CSClickReturn () {
	var bAgent = window.navigator.userAgent; 
	var bAppName = window.navigator.appName;
	if ((bAppName.indexOf("Explorer") >= 0) && (bAgent.indexOf("Mozilla/3") >= 0) && (bAgent.indexOf("Mac") >= 0))
		return true; /* dont follow link */
	else return false; /* dont follow link */
}
function CSButtonReturn () { return !CSClickReturn(); }
function CSBrowserSwitch(action) {
	var bAgent	= window.navigator.userAgent;
	var bAppName	= window.navigator.appName;
	var isNS		= (bAppName.indexOf("Netscape") >= 0);
	var isIE		= (bAppName.indexOf("Explorer") >= 0);
	var isWin		= (bAgent.indexOf("Win") >= 0); 
	var isMac		= (bAgent.indexOf("Mac") >= 0); 
	var vers		= 0;
	var versIdx	= (bAgent.indexOf("Mozilla/"));
	if(versIdx >= 0)
		{
		var sstr	= bAgent.substring(versIdx + 8, versIdx + 9);
		vers		= parseInt(sstr) - 2;
		}
	var url		= action[1];
	var platform	= action[2];
	var versVec;
	if(platform)
		{
		if(isNS && isMac) versVec = action[3];
		if(isIE && isMac) versVec = action[5];
		if(isNS && isWin) versVec = action[4];
		if(isIE && isWin) versVec = action[6];
		}
	else
		{
		if(isNS) versVec = action[3];
		if(isIE) versVec = action[4];
		}
	if(vers > (versVec.length-1))
		vers = versVec.length-1;
	if(versVec[vers] == 0)
		{
		location			= url;
		CSStopExecution	= true;	
		}
}
function CSURLPopupShow(formName, popupName, target) {
	var form  = (!IsIE()&&CSBVers>=5)?document.forms[formName]:CSFindElement(formName);
	var popup = form.elements[popupName];
	window.open(popup.options[popup.selectedIndex].value, target);
	popup.selectedIndex = 0;
}
function CSSetStyleDepth(s,depth) {
	if (CSIsW3CDOM)document.getElementById(s).style.zIndex=depth;
	else if (IsIE())CSIEStyl(s).zIndex=depth;
	else CSNSStyl(s).zIndex=depth;
}
function CSGetStyleDepth(s) {
	if (CSIsW3CDOM){CSIDOM();return document.getElementById(s).style.zIndex;}
	else if (IsIE())return (CSIEStyl(s).zIndex);
	else return (CSNSStyl(s).zIndex);
}
CSSeqArray = new Array;
function CSSeqActionFct(seq,loopCount,continueLoop) {
	if ((seq.loop < 2) || ((loopCount % 2) != 0)) {
		for (var i=0;i<seq.actionCount;i++) {
			if (seq.actions[3*i + 1] <= seq.frame) {
				if ((loopCount > 1) && (seq.actions[3*i + 1] < seq.start)) continue;
				if (seq.actions[3*i + 2] < loopCount) {
					seq.actions[3*i + 2] = loopCount; CSLoopIsRunning = true;
					CSAction(new Array(seq.actions[3*i + 0])); continueLoop = true;
				}
			} else { continueLoop = true; break; }
		}
	} else {
		for (var i=seq.actionCount-1;i>=0;i--) {
			if (seq.actions[3*i + 1] > seq.frame) {
				if (seq.actions[3*i + 1] > seq.end) continue;
				if (seq.actions[3*i + 2] < loopCount) {
					seq.actions[3*i + 2] = loopCount; CSLoopIsRunning = true;
					CSAction(new Array(seq.actions[3*i + 0])); continueLoop = true;
				}
			} else { continueLoop = true; break; }
		}
	}
	return continueLoop;
}		
function CSSeqFunction(fctInfo)
{
	var seq = fctInfo.data; var oldFrame = seq.frame;
	var newTicks = (new Date()).getTime();
	seq.frame = Math.round((seq.fps * (newTicks - seq.startTicks)/1000.0) - 0.5);
	var continueLoop  = false; var loopCount = 1;
	
	if (seq.loop > 0) {
		continueLoop = true;
		if (seq.loop == 1) {
			var iv = (seq.end - seq.start);
			var f = Math.round(((seq.frame - seq.start) / iv) - 0.5);
			if (f < 0) f = 0;
			loopCount = f+1;
			seq.frame = seq.start + ((seq.frame - seq.start) % (seq.end - seq.start));
		} else {
			var iv = (seq.end - seq.start);
			var f = Math.round(((seq.frame - seq.start) / iv) - 0.5);
			if (f < 0) f = 0;
			loopCount = f+1;
			f = (seq.frame - seq.start) % (2 * iv);
			if (f > iv) f = 2*iv - f;
			seq.frame = seq.start + f;
		}
	}
	continueLoop = CSSeqActionFct(seq,loopCount,continueLoop);
	for (var i=0;i<seq.tracks.length;i++) {
		var track = seq.tracks[i]; var frameCount = 0; var lastCount = 0; var partCount = 0;
		var partIdx = track.parts.ticks.length;
		for (var k=0;k<track.parts.ticks.length;k++) {
			frameCount += track.parts.ticks[k];
			if (frameCount > seq.frame) { partIdx = k; partCount = seq.frame - lastCount; break; }
			lastCount = frameCount;
		}
		if (partIdx < track.parts.ticks.length) {
			var type=track.parts.moveType[partIdx];
			if(type==1) CSSetLinearPos (track, partIdx, partCount);
			else if(type==2) CSSetCurvePos (track, partIdx, partCount);
			else if(type==3) if (oldFrame != seq.frame) CSSetRandomPos (track, partIdx, partCount);
							 else { x = CSGetStylePos(track.layer,0); y = CSGetStylePos(track.layer,1); }
			CSSetStyleVis(track.layer,track.parts.visibilities[partIdx]);
			CSSetStyleDepth(track.layer,track.parts.depths[partIdx]);
			continueLoop = true;
		} else {
			var partIdx = track.parts.moveType.length-1;
			var posArray = track.parts.positions;
			var x = posArray[partIdx * 6 + 0]; var y = posArray[partIdx * 6 + 1];
			CSSetStylePos(track.layer,0,x); CSSetStylePos(track.layer,1,y);
			CSSetStyleVis(track.layer,track.parts.visibilities[partIdx]);
			CSSetStyleDepth(track.layer,track.parts.depths[partIdx]);
		}
	}
	return continueLoop;
}
function CSSetLinearPos (track, partIdx, partCount) {
	var curTicks = track.parts.ticks[partIdx];
	var pIdx1 = partIdx * 6; var pIdx2 = (partIdx+1) * 6;
	var posArray = track.parts.positions;
	var x = posArray[pIdx1 + 0]; var y = posArray[pIdx1 + 1];
	var x1,x2,y1,y2;
	var factor = partCount/curTicks;
	x1 = x; y1 = y;
	x2 = posArray[pIdx2 + 0]; y2 = posArray[pIdx2 + 1];
	x = x1 * (1-factor) + x2 * factor; y = y1 * (1-factor) + y2 * factor;
	CSSetStylePos(track.layer,0,x); CSSetStylePos(track.layer,1,y);
}
function CSSetCurvePos (track, partIdx, partCount) {
	var curTicks = track.parts.ticks[partIdx];
	var pIdx1 = partIdx * 6; var pIdx2 = (partIdx+1) * 6;
	var posArray = track.parts.positions;
	var x = posArray[pIdx1 + 0]; var y = posArray[pIdx1 + 1];
	var x1,x2,x3,x4,y1,y2,y3,y4;
	var factor = partCount/curTicks;
	var t = factor; var u = t * t; var v = u * t;
	var val1 = 3*(u-t) - v + 1; var val2 = 3*(v+t - 2*u); var val3 = 3*(u-v); var val4 = v;
	x1 = x; y1 = y; x2 = posArray[pIdx1 + 2]; y2 = posArray[pIdx1 + 3];
	x3 = posArray[pIdx1 + 4]; y3 = posArray[pIdx1 + 5];
	x4 = posArray[pIdx2 + 0]; y4 = posArray[pIdx2 + 1];
	x = x1 * val1 + x2 * val2 + x3 * val3 + x4 * val4;
	y = y1 * val1 + y2 * val2 + y3 * val3 + y4 * val4;
	CSSetStylePos(track.layer,0,x); CSSetStylePos(track.layer,1,y);
}
function CSSetRandomPos (track, partIdx, partCount) {
	var curTicks = track.parts.ticks[partIdx];
	var pIdx1 = partIdx * 6; var pIdx2 = (partIdx+1) * 6;
	var posArray = track.parts.positions;
	var x = posArray[pIdx1 + 0]; var y = posArray[pIdx1 + 1];
	var x1,x2,y1,y2;
	var factor = partCount/curTicks;
	x1 = x; y1 = y;
	x2 = posArray[pIdx2 + 0]; y2 = posArray[pIdx2 + 1];
	var factorx = Math.random(); var factory = Math.random();
	x = x1 * (1-factorx) + x2 * factorx; y = y1 * (1-factory) + y2 * factory;
	CSSetStylePos(track.layer,0,x); CSSetStylePos(track.layer,1,y);
}
function CSStartSeq(name) {
	var seq = CSGetScene(name); var date = new Date()
	seq.startTicks = date.getTime()
	for (var i=0;i<seq.actionCount;i++) seq.actions[3*i+2] = 0;
	CSStartFunction(CSSeqFunction,seq);
}
function CSSceneObj (name,fps,loop,start,end,frame,sTicks,numAct,acts,tracks) {
	this.name=name;this.fps=fps;this.loop=loop;this.start=start;this.end=end;
	this.frame=frame;this.startTicks=sTicks;this.actionCount=numAct;
	this.actions=acts;this.tracks=tracks;
}
function CSTrackObj (name,partIdx,partCount,parts) {
	this.layer=name;this.partIdx=partIdx;this.partCount=partCount;this.parts=parts;
}
function CSPartObj (ticks,pos,depths,vis,moveType) {
	this.ticks=ticks;this.positions=pos;this.depths=depths;this.visibilities=vis;
	this.moveType=moveType;
}
function CSGetScene (name) {
	for (i=0;i<CSSeqArray.length;i++) { var seq = CSSeqArray[i]; if (seq.name==name) return seq; }
	return 0;
}
function CSAutoStartScene(action) { CSStartSeq (action[1]); }
/* -- Action Functions */
function CSActionGroup (action) {
	for(var i=1;i<action.length;i++) { CSAction(new Array(action[i])); }
}
function ROAddToNowPlayingList (act) {
	var i,url,clipinfo,related_info_url,width,height,media_browser_url,target;
	url=act[1];
	related_info_url=act[2];
	if(related_info_url=="(EmptyReference!)")related_info_url="";
	width=act[3];
	height=act[4];
	media_browser_url=act[5];
	if(media_browser_url=="(EmptyReference!)")media_browser_url="";
	if(act[6]==0)target="_rpbrowser";
	else target="_rpexternal";
	clipinfo="Album name="+act[7];
	clipinfo+="|Artist name="+act[8];
	clipinfo+="|CDNum="+act[9];
	clipinfo+="|Comments="+act[10];
	clipinfo+="|Genre="+act[11];
	clipinfo+="|Language="+act[12];
	clipinfo+="|Mood="+act[13];
	clipinfo+="|Preference="+act[14];
	clipinfo+="|Situation="+act[15];
	clipinfo+="|Title="+act[16];
	clipinfo+="|Year="+act[17];
	window.parent.external.AddToNowPlaying (url, clipinfo, related_info_url, width, height, media_browser_url, target);
}
// OUT Adjust Frame Sources 1.2.2
// Script copyright 1999 - 2002, OUT Media Design GmbH. All rights reserved.
// Must be called by the Frameset's OnLoad Handler
function OUTadjFrameSrcs() {
	var URLparams=window.location.search;
	if (URLparams!="") {
		URLparams=URLparams.substring(URLparams.indexOf('?')+1, URLparams.length);
		URLparams=URLparams.split('&');
        for (var i=0; i<URLparams.length; i++) {
            var p=URLparams[i].split('=');
            if (p[0]&&window.frames[p[0]]) {
                var newURLparams="?";
                for (var j=0;j<URLparams.length; j++) newURLparams+=(j!=i)?URLparams[j]+((j<URLparams.length-1)?"&":""):"";
                window.frames[p[0]].location.replace(p[1]+(newURLparams.length>1 ? newURLparams : "")+window.location.hash);
             }
         }
	}
	return true;
}
function CSCallAction(action)
{
	CSAction(new Array(action[1]));
}
function CSCallFunction(action)
{
	var str = action[1];
	str += "(";
	str += action[2];
	str += ");"
	return eval(str);
}
function ROClearNowPlayingList (act) {
	window.parent.external.ClearNowPlaying();
}
function CSshowtimedateID(action) {
	(action[2] != "") ? (updateobject = action[2]) : (updateobject = action[1])
	showtime = action[3]
	usemilitary = action[4]
	showdate = action[5]
	dateformat = action[6]
	showday = action[7]
	leadin = action[8]
	opentag = action[9]
	closetag = action[10]
	theTimer = setTimeout("theClockDate()",10);
}
function theClockDate() {   
	now = new Date()
	theMonth = now.getMonth() + 1
	theDate = now.getDate()
	theYear = now.getFullYear()
	theDay = now.getDay()
	hours = now.getHours()
	if(navigator.appVersion.indexOf("MSIE 5.0; Macintosh") != -1) {
	if (theMonth <= 11 && theMonth >= 4) { hours = hours + 1}
	}
	ampm = ((hours >= 12) ? "PM" : "AM");
	hours = ((hours > 12 && usemilitary == false) ? hours -12 : hours);
	if (hours == 0) hours = 12;
	if (hours >= 1 && hours <=9) hours = "0" + hours;
	minutes = now.getMinutes()
	if (minutes < 10) minutes = "0" + minutes;
	time = "";
	(showtime == true) ? (time = " " + hours + ":" + minutes) : (time = "",ampm="");
	(usemilitary == true) ? (ampm="") : (ampm=ampm);
	days = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
	today = days[theDay];
	if (showdate == true) {
		if (dateformat == 0) todisplay = theMonth + "/" + theDate + "/" + theYear;
		if (dateformat == 1) todisplay = theDate + "/" + theMonth + "/" + theYear;
		if (dateformat == 2) todisplay = theYear + "/" + theMonth + "/" + theDate;
		if (dateformat == 3) todisplay = theYear + "/" + theDate + "/" + theMonth;
		} else {todisplay = "" }
	if (showday == true) todisplay =  today + ", " + todisplay;
	if (document.all) { document.all(updateobject).innerHTML = opentag + leadin + todisplay + time + " " + ampm + closetag; } 
	else {
		if (document.getElementById) { document.getElementById(updateobject).innerHTML = opentag + leadin + todisplay + time + " " + ampm + closetag; }
}
theTimer = setTimeout("theClockDate()",2000);
}
function CSCloseWindow() { 
if (self.parent.frames.length != 0) {
	self.parent.close()	
	} else {
	window.close()
	}
}
function CSConditionAction(action) {
	if (action[1]) {
		if (CSAction(new Array(action[1])) == true) {
			if (action[2]) CSAction(new Array(action[2]));
		} else if (action[3]) CSAction(new Array(action[3]));
	}
}
function WBConfirmLink(action) {
	 if (checkIt(action)) {
		 if (action[2] != "(Empty Reference!)" && action[2] != "(EmptyReference!)") {
		 	if (action[3].length < 1) {
				parent.location.href=action[2];
			}
			else {
				parent.frames[action[3]].location.href=action[2];
			}
		}
	}
	return;
}
function checkIt(action) {
	var carryOn = window.confirm(action[1]);
	return carryOn;
	}
// OUT CSS Link Action 1.1
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
var OUTcssAgent = window.navigator.userAgent; OUTcssAppName = window.navigator.appName;
function OUTcssLink(action) {
	var OUTappVersion = (OUTcssAgent.indexOf("MSIE") >= 0) ? OUTcssAgent.substr(OUTcssAgent.indexOf("MSIE")+5,action[3].length) : OUTcssAgent.substr(OUTcssAgent.indexOf("Mozilla/")+8,action[3].length);
	if (action[1]!=null && action[1]!='') {
		var bOk = action[2]!='all' ? OUTcssAppName.indexOf(action[2]) >= 0 : true;
		var vOk = action[3]!= '0'  ? eval(parseFloat(OUTappVersion)+action[5]+parseFloat(action[3])) : true;
		var pOk = action[4]!='all' ? OUTcssAgent.indexOf(action[4]) >= 0 : true;	
		if (bOk && vOk && pOk)
			document.write('<LINK HREF="'+action[1]+'" REL="styleSheet" TYPE="text/css">');
		return true;
	} else
		return false;
}
function CSCSSRedirect(action) { 
if (navigator.platform.indexOf("Win32") != -1) { os = "windows" };
if (navigator.platform.indexOf("Mac") != -1) { os = "mac" };
if (navigator.platform.indexOf("x") != -1 || navigator.platform.indexOf("BSD") != -1 || navigator.platform.indexOf("S") != -1) { os = "unix" };
if (navigator.appName.indexOf("Microsoft") != -1) { browser = "IE" };
if (navigator.appName.indexOf("Netscape") != -1) { browser = "NN" };
if (navigator.appVersion.indexOf("4.") != -1) { version = 4 };
if (navigator.appVersion.indexOf("5.") != -1) { version = 5 };
var tag='<LINK REL="styleSheet" TYPE="text/css" HREF="'+action[2]+'" >';
var type=action[1];
	if(type==0 && os=="mac" && browser=="NN" && version==4) { document.write(tag) }
	else 
	if(type==1 && os=="mac" && browser=="NN" && version==5) { document.write(tag) }
	else 
	if(type==2 && os=="windows" && browser=="NN" && version==4) { document.write(tag) }
	else 
	if(type==3 && os=="windows" && browser=="NN" && version==5) { document.write(tag) }
	else 
	if(type==4 && os=="unix" && browser=="NN" && version==4) { document.write(tag) }
	else 
	if(type==5 && os=="unix" && browser=="NN" && version==5) { document.write(tag) }
	else 
	if(type==6 && os=="mac" && browser=="IE") { document.write(tag) }
	else 
	if(type==7 && os=="windows" && browser=="IE") { document.write(tag) }
}
function initIArray() {
this.length = initIArray.arguments.length;
for (var i = 0; i < this.length; i++)
this[i+1] = initIArray.arguments[i]; 
}
function dailyImageURL(action) {
var dateArray = new
initIArray("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday");
var today = new Date();
var day = dateArray[today.getDay()];
if (today.getDay() == 0) { day = "Sunday"; }
var img = null;
if (document.images) {
	if (!IsIE()&&CSBVers<5) img = CSFindElement(action[1],0);
	else img = document.images[action[1]];
		if (img) {
			if (day == "Monday" && action[2] != "(Empty Reference!)" && action[2] != "(EmptyReference!)") img.src = action[2]
			if (day == "Tuesday" && action[3] != "(Empty Reference!)" && action[3] != "(EmptyReference!)") img.src = action[3]
			if (day == "Wednesday" && action[4] != "(Empty Reference!)" && action[4] != "(EmptyReference!)") img.src = action[4]
			if (day == "Thursday" && action[5] != "(Empty Reference!)" && action[5] != "(EmptyReference!)") img.src = action[5]
			if (day == "Friday" && action[6] != "(Empty Reference!)" && action[6] != "(EmptyReference!)") img.src = action[6]
			if (day == "Saturday" && action[7] != "(Empty Reference!)" && action[7] != "(EmptyReference!)") img.src = action[7]
			if (day == "Sunday" && action[8] != "(Empty Reference!)" && action[8] != "(EmptyReference!)") img.src = action[8]
		}  
}  
}
function initArray() {
this.length = initArray.arguments.length;
for (var i = 0; i < this.length; i++)
this[i+1] = initArray.arguments[i]; 
}
function dailyRedirect(action) {
var dateArray = new
initArray("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday");
var today = new Date();
var day = dateArray[today.getDay()];
if (today.getDay() == 0) { day = "Sunday"; }
if (day == "Monday" && action[1] != "(Empty Reference!)" && action[1] != "(EmptyReference!)") window.location = action[1]
if (day == "Tuesday" && action[2] != "(Empty Reference!)" && action[2] != "(EmptyReference!)") window.location = action[2]
if (day == "Wednesday" && action[3] != "(Empty Reference!)" && action[3] != "(EmptyReference!)") window.location = action[3]
if (day == "Thursday" && action[4] != "(Empty Reference!)" && action[4] != "(EmptyReference!)") window.location = action[4]
if (day == "Friday" && action[5] != "(Empty Reference!)" && action[5] != "(EmptyReference!)") window.location = action[5]
if (day == "Saturday" && action[6] != "(Empty Reference!)" && action[6] != "(EmptyReference!)") window.location = action[6]
if (day == "Sunday" && action[7] != "(Empty Reference!)" && action[7] != "(EmptyReference!)") window.location = action[7]
}
function CSDeleteCookie(action) 
{
var name=action[1]
var value=action[2]
var jours=-12000
path="/"
domain=null
var expdate = new Date ();
expdate.setTime (expdate.getTime() + (jours * 60 * 60 * 1000));
SetCookie(name,value,expdate)
}
function SetCookie (name, value) {
  var argv = SetCookie.arguments;
  var argc = SetCookie.arguments.length;
  var expires = (argc > 2) ? argv[2] : null;
  var secure = (argc > 5) ? argv[5] : false;
  document.cookie = name + "=" + escape (value) +
    ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == true) ? "; secure" : "");
}
function CSdigitalclock(action){
img1 = CSGetImage(action[1]);
img2 = CSGetImage(action[2]);
img3 = CSGetImage(action[3]);
img4 = CSGetImage(action[4]);
usemilitary = action[5];
giflocation = action[6];
path = giflocation.substring(0, giflocation.length - 5);
extension = (giflocation.indexOf("jpg") != -1) ? (".jpg") : (".gif");
digClock();
}
function digClock() {   
now = new Date();
hours = now.getHours();
theMonth = now.getMonth();
if(navigator.appVersion.indexOf("MSIE 5.0; Macintosh") != -1) {
	if (theMonth <= 11 && theMonth >= 4) { hours = hours + 1 };
	if (hours == 24) { hours = 0 };
	}
minutes = now.getMinutes();
hours = ((hours > 12 && usemilitary == false) ? hours -12 : hours);
if (hours >= 0 && hours <=9) hours = "0" + hours;
if (usemilitary == false && hours == 00) { hours = 12 };
if (minutes >= 0 && minutes <=9) minutes = "0" + minutes;
hours = "" + hours;
minutes = "" + minutes;
hour1 = hours.substring(0,1);
hour2 = hours.substring(1,2);
minutes1 = minutes.substring(0,1);
minutes2 = minutes.substring(1,2);
updater();
}
	
function updater() {
img1.src = path + hour1 + extension;
img2.src = path + hour2 + extension;
img3.src = path + minutes1 + extension;
img4.src = path + minutes2 + extension;
theTimer = setTimeout("digClock()",1000);
}
function CSDocWrite(action) { document.write(action[1]); }
var gCSIEDragObject = null;
var gDragX,gDragY;
function CSSetupDrag (layerName) {
	this.x = 0; this.y = 0;
	if (IsIE()) {
		this.canDrag=true; 
		this.layerObj=document.all.tags("div")[layerName];
		this.layerObj.dragObj = this;
		document.ondragstart = CSIEStartDrag;
		document.onmousedown = CSIEMouseDown;
		document.onmouseup = CSIEStopDrag;
	} else {
		if (CSBVers>=5)
			{
			this.layerObj=document.getElementById(layerName);
			this.layerObj.addEventListener("mousedown", CSNS6StartDrag, true);
			this.layerObj.addEventListener("mouseup", CSNS6StopDrag, true);
			}
		else
			{
			this.layer=CSNSStyl(layerName);this.onmousemove=null; 
			this.layer.document.theLayer=this;
			this.layer.document.captureEvents(Event.MOUSEDOWN);
			this.layer.document.onmousedown=CSNSStartDrag; 
			this.layer.document.onmouseup=CSNSStopDrag;
			}
	}
}
function CSNS6StartDrag (ev) {
	CSIDOM();
	ev.currentTarget.addEventListener("mousemove", CSNS6DoDrag, true);
	gDragX=ev.clientX;
	gDragY=ev.clientY;
	ev.preventDefault();
}
function CSNS6DoDrag (ev) {
	var style=ev.currentTarget.style;
	style.left = parseInt(style.left)+(ev.clientX-gDragX)+"px";
	style.top = parseInt(style.top)+(ev.clientY-gDragY)+"px";
	gDragX=ev.clientX;
	gDragY=ev.clientY;
}
function CSNS6StopDrag (ev) {	
	ev.target.removeEventListener("mousedown", CSNS6StartDrag, true);
	ev.target.removeEventListener("mouseup", CSNS6StopDrag, true);
	ev.currentTarget.removeEventListener("mousemove", CSNS6DoDrag, true);
	ev.preventDefault();
}
function CSNSStartDrag (ev) {
	var clickInMe = false;
	if (ev.target != this) {
		for (var i=0;i<this.images.length;i++) {
			if (this.images[i] == ev.target) { clickInMe = true; break;}
			}
		}
	else clickInMe = true;	
	if (clickInMe)
		{
		this.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP); 
		this.onmousemove=CSNSDoDrag;
		this.theLayer.x= ev.pageX;
		this.theLayer.y= ev.pageY;
		this.routeEvent(ev);
		return false;
		}
   this.onmousemove=null;this.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
	this.routeEvent(ev);
   return true; 
}
function CSNSStopDrag (ev) {
   this.onmousemove=null;this.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);return false; 
}
function CSNSDoDrag (ev) {
	this.theLayer.layer.moveBy(ev.pageX-this.theLayer.x, ev.pageY-this.theLayer.y); 
	this.theLayer.x = ev.pageX; 
	this.theLayer.y = ev.pageY;
	this.routeEvent(ev);
}
function CSIEStartDrag () {
	if(gCSIEDragObject != null && (gCSIEDragObject.tagName==event.srcElement.tagName))
		event.returnValue=false;  
}
function CSIEStopDrag () { gCSIEDragObject=null; document.onmousemove=null; }
function CSIEMouseDown () {
	if(event.button==1) {
		dragLayer = event.srcElement;
		while (dragLayer!=null) 
			{
			if ((dragLayer.dragObj == null) && (dragLayer.tagName == "DIV"))
				break;
			if (dragLayer.dragObj != null)
				break;
			dragLayer=dragLayer.parentElement;
			}
			
		if (dragLayer == null) return;
		if (dragLayer.dragObj!=null && dragLayer.dragObj.canDrag) {
			gCSIEDragObject = dragLayer;
			gCSIEDragObject.dragObj.x=event.clientX;
			gCSIEDragObject.dragObj.y=event.clientY;
			document.onmousemove = CSIEMouseMove;
		}
	}
}
function CSIEMouseMove () {
	gCSIEDragObject.dragObj.layerObj.style.pixelLeft+=(event.clientX-gCSIEDragObject.dragObj.x);
	gCSIEDragObject.dragObj.layerObj.style.pixelTop+=(event.clientY-gCSIEDragObject.dragObj.y);
	gCSIEDragObject.dragObj.x=event.clientX;
	gCSIEDragObject.dragObj.y=event.clientY;
	event.returnValue = false;
	event.cancelBubble = true;
}
var gDragArray = new Array();
function CSDrag(action) { gDragArray[gDragArray.length] = new CSSetupDrag(action[1]); }
function ROEmbeddedActions (act) {
	var fct,i,j,name,nsemb;
	name=act[1];
	if (!IsIE())nsemb = ROFindEmbed(name);
   	if(act[2]!="") {
		fct=act[2]; fct+="(";
		if(act[3]==undefined)
			fct+=")";
		for(i=3; i<act.length; i++) {
			fct+="\'"; fct+=act[i]; fct+="\'";
			if(i==act.length-1)fct+=")";
			else fct+=",";
		}
	}
	if(IsIE()) return eval(name+"."+fct);
	else {
		if(nsemb) return nsemb.eval(fct);
	}
}
// OUT Execute JavaScript Action
// Script copyright 1999, OUT Media Design GmbH. All rights reserved.
function OUTexecuteJS(action) {
	return eval(action[1]);
}
function CSFieldValidate(action) { 
var form = action[1];
var elem = action[2];
var theEntry  = document.forms[form].elements[elem].value
var theFormElem = document.forms[form].elements[elem]
var badEntry = ""
	function theAlert () { 
	alert(action[6]);
	theFormElem.select();
	theFormElem.focus();
	}  	
	function isEmpty() { 
		if (theEntry == "") { 
		theAlert()
		} 	
	}
	function isNumber() { 
			if (theEntry == "") { 
			theAlert()
			} 		
		for (i=0; i<theEntry.length; i++) {  
			if (theEntry.charAt(i) < "0" || theEntry.charAt(i) > "9") {  
				badEntry = "notnumber"
				} 
			}  		
		if (badEntry == "notnumber") {
		theAlert()	
		}	
	} 
		
	function isAlpha() { 
			if (theEntry == "") { 
			theAlert()
			} 		
		for (i=0; i<theEntry.length; i++) {  
			if (theEntry.charAt(i) >= "0" && theEntry.charAt(i) <= "9") {  
				badEntry = "notalpha"
				} 
			}  		
		if (badEntry == "notalpha") {
		theAlert()	
		}	
	} 
				
	function requiredChars() {
	numofChars = theEntry.length
		if (numofChars != action[4]) {
			theAlert()
		} 
	}	
	function exactString() {
		if (theEntry != action[5]) {
			theAlert()
		} 
	}	
	
	function validEmail() {
		invalidChars = " /:,;"		
		if (theEntry == "") { 
			badEntry = "badEmail"
			}
		for (i=0; i < 5; i++)  {
			badChar = invalidChars.charAt(i)
				if (theEntry.indexOf(badChar,0) > -1) {
				badEntry = "badEmail"
				}
		}	
	atsignLoc = theEntry.indexOf("@",1)
		if (atsignLoc == -1) {
			badEntry = "badEmail"
		}		
		if (theEntry.indexOf("@",atsignLoc+1) > -1) {
		badEntry = "badEmail"
		}
	dotLoc = theEntry.indexOf(".",atsignLoc)
		if (dotLoc == -1) {
		badEntry = "badEmail"
		}
		if (dotLoc+3 > theEntry.length) {
		badEntry = "badEmail"
		}
		if (badEntry == "badEmail") {
		theAlert()
		}
	}
	function validCC() { 
	var theNumber = new Array(theEntry.length);
	var i = 0
	var total = 0
		for (i = 0; i < theEntry.length; ++i) {
		theNumber[i] = parseInt(theEntry.charAt(i))
		}
		for (i = theNumber.length -2; i >= 0; i-=2) {  
		theNumber[i] *= 2;							 
		if (theNumber[i] > 9) theNumber[i]-=9;			 
		}										 
		for (i = 0; i < theNumber.length; ++i) {
		total += theNumber[i];						 
		}	
		isinteger = total/10
		if(parseInt(isinteger)!=isinteger) {
		theAlert()
		}
	}
	
var type=action[3];
if(type==0) isEmpty()
else if(type==1) isNumber()
else if(type==2) isAlpha()
else if(type==3) requiredChars()
else if(type==4) exactString()
else if(type==5) validEmail()
else if(type==6) validCC()
}
		
function CSFlipMove(action) {
	if (action[1] == '') return;
	var curX = CSGetStylePos(action[1],0); var curY = CSGetStylePos(action[1],1);
	var x1 = action[2][0];
	var y1 = action[2][1];
	if ((x1 != curX) || (y1 != curY)) CSSlideLayer(action[1],action[2],action[4],action[5]);
	else CSSlideLayer(action[1],action[3],action[4],action[5]);
}
if (navigator.appName == "Netscape" && navigator.appVersion.charAt(0) >=5) {
	leftH = ".left";
	topV = ".top";
	nndoc = "document.getElementById(layername).style";
	iestyle = "";
	offsetH = "window.pageXOffset";
	offsetV = "window.pageYOffset";
	} 
	
	else if (navigator.appName == "Netscape" && navigator.appVersion.charAt(0) >=4) {
	leftH = ".left";
	topV = ".top";
	nndoc = "document.";
	iestyle = "";
	offsetH = "window.pageXOffset";
	offsetV = "window.pageYOffset";	
	} 
	
	else if (navigator.appName == "Microsoft Internet Explorer") {
	leftH = ".pixelLeft";
	topV = ".pixelTop";
	nndoc = "";
	iestyle = "document.getElementById(layername).style";
	offsetH = "document.body.scrollLeft";
	offsetV = "document.body.scrollTop";
	}
function getnewPos() {
var currentH = eval(offsetH);
var currentV = eval(offsetV);
x = parseInt(currentH) + parseInt(xpos);
y = parseInt(currentV) + parseInt(ypos);
moveLayer();
setTimeout("getnewPos()",10)
}
function CSFloatLayer(action) {
layername = action[1];
ypos = action[2];
xpos = action[3];
if (navigator.appVersion.charAt(0) >=5 || navigator.appName == "Microsoft Internet Explorer") {
	leftPos = eval(nndoc + iestyle + leftH);
	topPos = eval(nndoc + iestyle + topV);
	} else {
	leftPos = eval(nndoc + layername + iestyle + leftH);
	topPos = eval(nndoc + layername + iestyle + topV);
	}
	getnewPos()
	}
function moveLayer() {
if (navigator.appVersion.charAt(0) >=5  || navigator.appName == "Microsoft Internet Explorer") {
	eval(nndoc + iestyle + topV + "=" + y);
	eval(nndoc + iestyle + leftH + "=" + x);
	} else {
	eval(nndoc + layername + iestyle + topV + "=" + y);
	eval(nndoc + layername + iestyle + leftH + "=" + x);
	}
}
function frameP(action) {
		if(parent.frames.length==0) {
			var fileName=window.location.href.substring(window.location.href.lastIndexOf("/")+1,window.location.href.length);
			window.location.href=action[1]+"?"+action[2]+"="+fileName;
		} else {
			if(top.location.search!="") {
				var sFrame=top.location.search.substring(1,top.location.search.indexOf("="));
				if(name==sFrame) {
					var sName=top.location.search.substring(top.location.search.indexOf("=")+1,top.location.search.length);
					var fileName=window.location.href.substring(window.location.href.lastIndexOf("/")+1,window.location.href.length);
					if(fileName!=sName) {
						location=sName;
					}
				}
			}
		}
	}
function ROGetClipInfo (act) {
	var property,type;
	type=act[1];
	if(type==0)property="Album name";
	else if(type==1)property="Artist name";
	else if(type==2)property="CDNum";
	else if(type==3)property="Comments";
	else if(type==4)property="Genre";
	else if(type==5)property="Language";
	else if(type==6)property="Mood";
	else if(type==7)property="Preference";
	else if(type==8)property="Situation";
	else if(type==9)property="Title";
	else if(type==10)property="Year";
	else return "";
	return window.parent.external.GetClipInfo (property);
}
function CSGetFormElementValue(action) { 
	var form = action[1];
	var elem = action[2];
	return document.forms[form].elements[elem].value;
}
function ROGetInstalledComponents() {
	return window.parent.external.InstalledComponents;
}
function CSGetLayerPos(action) { 
	var layer = action[1];
	var x		= CSGetStylePos(layer, 0);
	var y		= CSGetStylePos(layer, 1);
	return new Array(x, y);
}
function ROGetPlayerProperty (act) {
	var property,type;
	type=act[1];
	if(type==0)property="APIVERSION";
	else if(type==1)property="BANDWIDTH";
	else if(type==2)property="COUNTRYID";
	else if(type==3)property="DISTRIBUTION";
	else if(type==4)property="INSTALLPATH";
	else if(type==5)property="LANGUAGEID";
	else if(type==6)property="LANGUAGEPREFERENCE";
	else if(type==7)property="OSNAME";
	else if(type==8)property="PRODUCTNAME";
	else if(type==9)property="PRODUCTVERSION";
	else if(type==10)property="REGIONDATE";
	else return "";
	return window.parent.external.PlayerProperty(property);
}
function ROGetPlayerState() {
	var result,state;
	state=window.parent.external.GetPlayerState();
	switch(state) {
		case 0:
			result="Stopped";break;
		case 1:
			result="Contacting";break;
		case 2:
			result="Buffering";break;
		case 3:
			result="Playing";break;
		case 4:
			result="Paused";break;
		case 5:
			result="Seeking";break;
		default:
			result="";break;
	}
	return result;
}
function ROGetVersionNumber (act) {
	var comp,min,max,result,type,unpack;
	type=act[1];
	if(type==0 && act[2]=="") {
		result=window.parent.external.RealPlayerVersion;
	}
	else {
		if(type==1)comp="audp";
		else if(type==2)comp="DBCMpg1";
		else if(type==3)comp="Flash";
		else if(type==4)comp="GF";
		else if(type==5)comp="GFJP";
		else if(type==6)comp="imgp";
		else if(type==7)comp="MP3PL";
		else if(type==8)comp="MPGA";
		else if(type==9)comp="PNG";
		else if(type==10)comp="RA";
		else if(type==11)comp="RealTxt";
		else if(type==12)comp="RichFX";
		else if(type==13)comp="RPix";
		else if(type==14)comp="RV";
		else if(type==15)comp="sdp";
		else if(type==16)comp="vidp";
		if(act[2]!="")comp=act[2];
		max=act[3];
		min=act[4];
		result=window.parent.external.ComponentVersion (comp+":"+max+"."+min);
	}
	unpack=act[5];
	if(unpack)
		result=ROUnpackVersionNumber (result);
	return result;
}
function CSGoBack1() { history.back() }
function CSGotoLink(action) {
	if (action[2].length) {
		var hasFrame=false;
		for(i=0;i<parent.frames.length;i++) { if (parent.frames[i].name==action[2]) { hasFrame=true; break;}}
		if (hasFrame==true)
			parent.frames[action[2]].location = action[1];
		else
			window.open (action[1],action[2],"");
	}
	else location = action[1];
}
function ROHandleAction (act) {
	var str,type;
	type=act[1];
	if(type==0)str="CD";
	else if(type==1)str="MyDevices";
	else if(type==2)str="NowPlaying";
	else if(type==3)str="Radio";
	else if(type==4)str="ShowEqualizer";
	else if(type==5)str="Web";
	else return;
	window.parent.external.HandleAction(str);
}
function CSIdleObject (action) {
	this.conditionAction = action[2];
	this.trueAction = action[3];
	this.falseAction = action[4];
	this.exitIdleIfTrue = action[1];
	this.lastState = false;
}
function CSIdleAction(action) {
	idleObj = new CSIdleObject (action);
	CSStartFunction (CSDoIdle,idleObj);
}
function CSDoIdle (param) {
	idleObject=param.data;
	if (idleObject.conditionAction) {
		gCurrentIdleObject = idleObject;
		var result = CSAction(new Array(idleObject.conditionAction));
		if (result == true && idleObject.lastState==false) {
			idleObject.lastState = result;
			if (idleObject.trueAction) {
				CSAction(new Array(idleObject.trueAction));
				if (idleObject.exitIdleIfTrue == true) return false;
			}
		} else if (result == false && idleObject.lastState == true) {
			idleObject.lastState = false;
			if (idleObject.falseAction) {
				CSAction(new Array(idleObject.falseAction));
			}		
		}
	}
	return true;
}
// OUT Image Slide Show Action v1.1.4
// Script copyright 1999, 2000, OUT Media Design GmbH. All rights reserved.
function OUTimageSlideShow(action){
	
	if(document.images!=null){
		var img=CSGetImage(action[1]);
		if(action[3] < action[2]){
			var li=action[3];action[3]=action[2];action[2]=li;
		}
		img.OUTsupportsOnLoad=!CSIsW3CDOM ||(img.isSupported?img.isSupported("Events","2.0"):true);
		if(img.OUTsupportsOnLoad)img.onload=OUTtriggerLoadNextImage;
		img.OUTfirstIndex=action[2];img.OUTlastIndex=action[3];img.OUTminTime=action[4];img.OUTmaxTime=action[5];img.OUTisRandom=action[6];img.OUTisReverse=action[7];img.OUTisLoop=action[8];img.OUTisPalindrome=action[9];
		img.OUTbaseURL=img.src.substring(0,(img.src.lastIndexOf('/')+1));
		img.OUTdocName=img.src.substring(img.src.lastIndexOf('/')+1,img.src.lastIndexOf('.'));
		img.OUTdocType=img.src.substring(img.src.lastIndexOf('.'),img.src.length);
		img.OUTcurIndex=img.OUTdocName.split('_'); img.OUTcurIndex.reverse(), img.OUTcurIndex=img.OUTcurIndex[0];
		img.OUTstartIndex=img.OUTcurIndex;
		img.OUTisPalinBack=false;
		img.OUTgetNextIndex=OUTgetNextImageIndex;
		img.OUTdocPrefix=img.OUTdocName.lastIndexOf('_')>0?img.OUTdocName.substring(0,img.OUTdocName.lastIndexOf('_')): '';
		if(img.OUTslideShowTimeoutID)clearTimeout(img.OUTslideShowTimeoutID);
		img.OUTslideShowTimeoutID=0;
		OUTtriggerLoadNextImage(img.name);
		img.OUTstop=false;
		return true;
	}
	return true;
}
function OUTtriggerLoadNextImage(img)
{
	img=typeof(img)=="string"?CSGetImage(img):this;
	clearTimeout(img.OUTslideShowTimeoutID);
	var time=OUTrandomBetween(img.OUTminTime,img.OUTmaxTime);
	if(!img.OUTsupportsOnLoad){
		OUTloadNextImage(img.name);
		if(!img.OUTstop)img.OUTslideShowTimeoutID=setTimeout('OUTtriggerLoadNextImage("'+img.name+'")', time);
	} else {
		img.OUTslideShowTimeoutID=setTimeout('OUTloadNextImage("'+img.name+'")', time);
	}
	return true;
}
function OUTloadNextImage(imgName)
{
	if(document.images!=null){
		var img=CSGetImage(imgName);
		
		if(img.OUTisRandom){			
			oldIndex=img.OUTcurIndex;
			while(oldIndex==img.OUTcurIndex){
				img.OUTcurIndex=Math.round(OUTrandomBetween(img.OUTfirstIndex,img.OUTlastIndex));
			}
		} else {
			img.OUTcurIndex=img.OUTgetNextIndex(img.OUTcurIndex);
			nextIndex=img.OUTgetNextIndex(img.OUTcurIndex);
			if(img.OUTisPalindrome &&(img.OUTisPalinBack?img.OUTcurIndex==img.OUTstartIndex:nextIndex==img.OUTstartIndex)){img.OUTisReverse=!img.OUTisReverse;img.OUTisPalinBack=!img.OUTisPalinBack;}
			if(!img.OUTisPalindrome && !img.OUTisLoop &&(img.OUTisPalinBack?img.OUTcurIndex==img.OUTstartIndex:nextIndex==img.OUTstartIndex)){clearTimeout(img.OUTslideShowTimeoutID);img.OUTslideShowTimeoutID=0;img.OUTstop=true;img.onload=null;}
			if(img.OUTisPalindrome && !img.OUTisLoop && nextIndex==img.OUTstartIndex)img.OUTisPalindrome=!img.OUTisPalindrome;
		}
		var imgDocName=img.OUTdocPrefix.length>0?img.OUTdocPrefix+'_'+img.OUTcurIndex:img.OUTcurIndex;
		img.src=img.OUTbaseURL + imgDocName + img.OUTdocType;
		return true;
	}
	return true;
}
function OUTgetNextImageIndex(nextIndex)
{
	if(this.OUTisReverse){
		nextIndex=(--nextIndex >= this.OUTfirstIndex && nextIndex < this.OUTlastIndex)?nextIndex:this.OUTlastIndex;
	} else {
		nextIndex=(++nextIndex <= this.OUTlastIndex && nextIndex > this.OUTfirstIndex)?nextIndex:this.OUTfirstIndex;
	}
	return nextIndex;
}
function OUTrandomBetween(min, max)
{
	return min +((max - min)* Math.random());
}
function CSLayerIntersect (condition)
{
	var l1,t1,r1,b1,l2,t2,r2,b2;
	if (IsIE()) {
		var layer1=document.all.tags("div")[condition[1]];
		var layer2=document.all.tags("div")[condition[2]];
		l1=layer1.style.pixelLeft; t1=layer1.style.pixelTop; r1=layer1.offsetWidth+l1; b1=layer1.offsetHeight+t1;
		l2=layer2.style.pixelLeft; t2=layer2.style.pixelTop; r2=layer2.offsetWidth+l2; b2=layer2.offsetHeight+t2;	
	} else {
		var layer1=CSNSStyl(condition[1]);
		var layer2=CSNSStyl(condition[2]);
		if (CSBVers>=5)
			{
			CSIDOM();
			l1=parseInt(layer1.left); t1=parseInt(layer1.top); r1=parseInt(layer1.width)+l1; b1=parseInt(layer1.height)+t1;
			l2=parseInt(layer2.left); t2=parseInt(layer2.top); r2=parseInt(layer2.width)+l2; b2=parseInt(layer2.height)+t2;
			}
		else
			{
			l1=layer1.x; t1=layer1.y; r1=layer1.clip.width+l1; b1=layer1.clip.height+t1;
			l2=layer2.x; t2=layer2.y; r2=layer2.clip.width+l2; b2=layer2.clip.height+t2;
			}
	}
	var w = (r1 < r2 ? r1 : r2) - (l1 > l2 ? l1 : l2)
	var h = (b1 < b2 ? b1 : b2) - (t1 > t2 ? t1 : t2)
	return ((w >= 0) && (h >= 0));
}
function CSKeePress(action) {
desiredKey1 = action[1];
calledAction1 = action[2];
desiredKey2 = action[3];
calledAction2 = action[4];
desiredKey3 = action[5];
calledAction3 = action[6];
desiredKey4 = action[7];
calledAction4 = action[8];
if (document.layers) { document.captureEvents(Event.KEYPRESS) ; }
document.onkeydown = checkKey;
function checkKey(e) {
	e = (e) ? e : (window.event) ? window.event : "";
	if (e) { var keyPressed = ""
			 if (e.which)  keyPressed = e.which; 
			 else  keyPressed = event.keyCode;
			 alphaNum = String.fromCharCode(keyPressed).toLowerCase();
			 if (desiredKey1 == alphaNum) { CSAction(new Array(calledAction1)) };
			 if (desiredKey2 == alphaNum) { CSAction(new Array(calledAction2)) };
			 if (desiredKey3 == alphaNum) { CSAction(new Array(calledAction3)) };
			 if (desiredKey4 == alphaNum) { CSAction(new Array(calledAction4)) };
	}
}
checkKey();
}
CSCurrentPressedKey = -1;
function CSKeyPress(ev) {
	var code;
	if(IsIE()) CSCurrentPressedKey = event.keyCode;
	else CSCurrentPressedKey = ev.which;
}
document.onkeypress	= CSKeyPress;
function CSKeyCompare(condition)
{
	var eq = (condition[1] == CSCurrentPressedKey);
	if(eq)
		CSCurrentPressedKey = -1;
	return eq;
}
function CSPAKkillframe() { 
if (self.parent.frames.length != 0)
self.parent.location = document.location
}
function CSshowdate(action) {
	form = action[1];
	elem = action[2];
	modified = new Date(document.lastModified);
	theMonth = modified.getMonth() + 1;
	theDate = modified.getDate();
	theYear = (navigator.appVersion.indexOf("3.0") != -1) ? (modified.getYear()) : (modified.getFullYear());
	theDay = modified.getDay();
	days = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
	modified = new Date(document.lastModified);
	today = days[theDay];
	if (action[3] == 0) todisplay = theMonth + "/" + theDate + "/" + theYear;
	if (action[3] == 1) todisplay = theDate + "/" + theMonth + "/" + theYear;
	if (action[3] == 2) todisplay = theYear + "/" + theMonth + "/" + theDate;
	if (action[3] == 3) todisplay = theYear + "/" + theDate + "/" + theMonth;
	if (action[4] == true) todisplay = today + ", " + todisplay;
	if(form != "" || elem != "") { document.forms[form].elements[elem].value = todisplay} ;
	if (action[5] == false) { alert(todisplay) } 
		}
function CSshowdateID(action) {
(action[2] != "") ? (updateobject = action[2]) : (updateobject = action[1]);
modified = new Date(document.lastModified);
theMonth = modified.getMonth() + 1;
theDate = modified.getDate();
theYear = (navigator.appVersion.indexOf("3.0") != -1) ? (modified.getYear()) : (modified.getFullYear());
theDay = modified.getDay();
days = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
today = days[theDay];
if (action[3] == 0) todisplay = theMonth + "/" + theDate + "/" + theYear;
if (action[3] == 1) todisplay = theDate + "/" + theMonth + "/" + theYear;
if (action[3] == 2) todisplay = theYear + "/" + theMonth + "/" + theDate;
if (action[3] == 3) todisplay = theYear + "/" + theDate + "/" + theMonth;
if (action[4] == true) todisplay = today + ", " + todisplay;
if (document.all) { document.all(updateobject).innerHTML = action[6] + action[5] + todisplay + action[7]
	 } else {
	if (document.getElementById) { document.getElementById(updateobject).innerHTML = action[6] + action[5] + todisplay + action[7] }
	}
}
// OUT utility Javascript library 1.4.3
// Script copyright 1999-2001 OUT Media Design GmbH. All rights reserved.
// This version needs the Adobe GoLive Netscape 6 Fix installed to work in NN6
var CSIsW3CDOM = CSIsW3CDOM; // declare variable in case the NN6 Fix isn't installed
if(!CSIsW3CDOM) { CSIsW3CDOM = false; } // define in case the NN6 Fix isn't installed
function OUTFindFrame(n,win) {
	var curFrames = win ? win.frames : top.frames;
	var frame = n=='' ? window : curFrames[n];
	if (!frame) {
		for (var i=0;i<curFrames.length;i++) {
			frame = OUTFindFrame(n,curFrames[i]);
			if (frame)
				return frame;
		}
	}
	return frame;
}
function OUTFindElement(n,ly,cmp) {
	if (cmp) n=OUTfindComponentElementName(n,ly);
	if (CSIsW3CDOM) { CSInitImgID();return document.getElementById(n); } 
	var curDoc = ly ? (ly.document ? ly.document : ly) : document;
	var elem = curDoc[n];
	if (!elem && curDoc.layers) { for (var i=0;i<curDoc.layers.length;i++) {
		elem = OUTFindElement(n,curDoc.layers[i]); if (elem) return elem; }}
	return elem;
}
// functions to search for AGL component objects named like this "Cmp003B4E7300brian"
function OUTfindComponentElementName(n,ly){
	var objn = '';
	var curDoc = ly ? (ly.document ? ly.document : ly) : (document.all ? document.all : document);
	if (CSIsW3CDOM) {
		curDoc = document.getElementsByTagName("*");
		for (var i=0; i<curDoc.length; i++) {
			objn = curDoc[i].name;
			if (objn && objn.indexOf("Cmp")==0 && objn.substr(13)==n) return objn;
 		}
	}
	else {
		for (objn in curDoc) {
			if (objn && objn.indexOf("Cmp")==0 && objn.substr(13)==n) return objn;
 		}
		if (!IsIE() && curDoc.layers) { for (var i=0;i<curDoc.layers.length;i++) {
			objn = OUTfindComponentElementName(n,curDoc.layers[i]);if (objn) return objn; }
		}
	}
	return null;
}
function OUTgetValuesFromURL(n) {
	var u=window.location.search;
	var a=new Array();
	if (u!="") {
		u=u.substring(u.indexOf('?')+1, u.length);
		u=u.split('&');
        for (var i=0; i<u.length; i++) { var p=u[i].split('='); if (p[0]==n) a[a.length]=p; }
	}
	return a;
}
function OUTcheckValueFromURL(n,v) {
	var a = OUTgetValuesFromURL(n);
	if (a) { for (var i in a) { if (a[i] && a[i][1]==v) return true; } }
	return false;
}
// OUT Load Frameset Action 1.2.5
// Script copyright 1999-2002, OUT Media Design GmbH. All rights reserved.
function OUTloadFrameset(action) {
	if (!parent.frames[action[2]] && !OUTcheckValueFromURL("OUTnoFrameset")) {
		var URLparams = window.location.search;
		var wl = window.location.href;
		if (URLparams!="") URLparams = "&"+URLparams.substring(1,URLparams.length);
		var nURL = action[1]; nURL += nURL.indexOf('?')>0?'&':'?';
		window.location.replace(nURL+action[2]+"="+(action[3]?wl.substring(0,wl.indexOf('?')>0?wl.indexOf('?'):wl.length):window.location.pathname)+URLparams+window.location.hash);
		return true;
	}
	return false;
}
// OUT Lock Rollover Action Script Library 1.3.6
// Script copyright 1999 - 2002 OUT Media Design GmbH. All rights reserved.
var OUTlckTimeout = new Array();
var OUTlckIm = new Object();
function OUTdoLckBtnIm(action,cmp) {
	var n = cmp ? OUTfindComponentElementName(action[1]) : action[1];
	var g = OUTlckGrpName(action[2]);
	var img = null;
	OUTlckTimeout[n] = OUTlckTimeout[n] ? clearTimeout(OUTlckTimeout[n]) : 0;
	if (n!="" && !CSIm[n]) {//in case the CSIm object is not available, defer locking
		OUTlckTimeout[n] = setTimeout("OUTdoLckBtnIm(new Array('','"+action[1]+"','"+action[2]+"',"+action[3]+"),"+cmp+")",500);
		return false;
	}
	if (document.images) {
		if (!OUTlckIm[g]){//create group if not available
			eval("OUTlckIm."+g +" = new Object()");
			OUTlckIm[g].name='';OUTlckIm[g].main='';OUTlckIm[g].over='';
		} else if (OUTlckIm[g].name!=n) {
			var lckd = OUTlckIm[g].name;
			if (CSIm[lckd]) {//restore last locked image
				img = (!IsIE()) ? OUTFindElement(lckd,0) : document[lckd];
				if (img) {
					img.src = OUTlckIm[g].main;
					CSIm[lckd][0].src = OUTlckIm[g].main;
					CSIm[lckd][1].src = OUTlckIm[g].over;
				}
			}
		}
		if (CSIm[n] && OUTlckIm[g].name!=n) {//lock image
			//save new locked image
			OUTlckIm[g].main = CSIm[n][0].src;
			OUTlckIm[g].over = CSIm[n][1].src;
			//replace main & over with click image
			CSIm[n][0].src = CSIm[n][2].src;
			if (action[3]!=true) CSIm[n][1].src = CSIm[n][2].src;
		}
		OUTlckIm[g].name = n; // change name here to allow unlock
		//display image
		CSIShow(n,2);
		return true;
	}
	return false;
}
function OUTlckGrpName(g) {  return g ? "group_"+g : "group_all"; }
// OUT Lock Rollover from URL 1.1
// Script copyright 2000-2002, OUT Media Design GmbH. All rights reserved.
function OUTlckRolloverURL() {
	var URLparams=window.location.search;
	var action = new Array(3);
	action[1] = "";
	action[2] = "";
	action[3] = true;
	if (URLparams!="") {
		URLparams=URLparams.substring(URLparams.indexOf('?')+1, URLparams.length);
		URLparams=URLparams.split('&');
        for (var i=0; i<URLparams.length; i++) {
            var p=URLparams[i].split('=');
            if (p[0]&&p[0]=='OUT_lckBtn') action[1]=p[1];
            if (p[0]&&p[0]=='OUT_lckGrp') action[2]=p[1];
            if (p[0]&&p[0]=='OUT_lckOvr') action[3]=(p[1]=="no" || p[1]=="false" || p[1]=="0")?true:false; //invert setting
         }
		OUTdoLckBtnIm(action,false);
	}
	return true;
}
var myLayer = false;
var offSetX = 1;
var offSetY = 1;
function CSMouseFollow(action,offX,offY){
	myLayer = action[1];
	if(offX){offSetX=offX;}
	if(offY){offSetY=offY;}
	if (navigator.appName == "Netscape") {
		document.captureEvents(Event.MOUSEMOVE);
	} else {
		if(navigator.appVersion.indexOf("Mac")!=-1){offSetX=offSetX-18;}
	}
	document.onmousemove = mouseLayer;
}
function mouseLayer(e){
	if (navigator.appName == "Netscape" && navigator.appVersion.charAt(0) >=5) {
		document.getElementById(myLayer).style.left = (e.pageX+offSetX);
		document.getElementById(myLayer).style.top = (e.pageY+offSetY); 
		}
		else if (navigator.appName == "Netscape") {
			document.layers[myLayer].moveBy(
			(e.pageX+offSetX) - document.layers[myLayer].left, 
			(e.pageY+offSetY) - document.layers[myLayer].top);
	   		 return true; 
		} else {
		document.all[myLayer].style.pixelLeft = (event.x+offSetX);
		document.all[myLayer].style.pixelTop = (event.y+offSetY);
		event.cancelBubble = true;
		event.returnValue = false;
	}
}
function CSMoveBy(action)
{
	x = CSGetStylePos(action[1], 0);
	y = CSGetStylePos(action[1], 1);
	x += parseInt(action[2]);
	y += parseInt(action[3]);
	x = CSSetStylePos(action[1], 0, x);
	y = CSSetStylePos(action[1], 1, y);
}
function CSMoveTo(action) { CSSlideLayer(action[1],action[2],action[3],action[4]); }
function CSHistoryGo(action) { history.go(action[1]); }
function RONavigateToURL (act) {
	var target,type,url,delay;
	url=act[1];
	type=act[2];
	if(type==0)target="_rpbrowser";
	else target="_rpexternal";
	delay=act[3]*1000;
	if(delay>0) {
		var obj=new Object();
		obj.type="navigate";
		obj.time=delay;
		obj.url=url;
		obj.target=target;
		if(ROOnPLCArray)
			ROOnPLCArray[ROOnPLCArray.length]=obj;
	}
	else
		window.parent.external.HandleAction("NavigateToURL("+url+","+target+")");
}
function CSFixFct() {
	var d = document; var w = window;
	if (d.cs.csFix.w != w.innerWidth || d.cs.csFix.h != w.innerHeight) {
		d.location = d.location; }
}
function CSNSFix(action) { 
	var d = document; var w = window;
	if ((navigator.appName == 'Netscape') && (parseInt(navigator.appVersion) == 4)) {
		if (typeof d.cs == 'undefined') { 
			d.cs = new Object;
			d.cs.csFix = new Object; 
		} else if (CSIsFrame (w) == true) CSFixFct();
		d.cs.csFix.w = w.innerWidth;
		d.cs.csFix.h = w.innerHeight; 
		window.onresize = CSFixFct;
	  }
}
function CSIsFrame (window) {
	var rootWindow = window.parent;
	if (rootWindow == 'undefined') return false;
	for (i = 0; i < rootWindow.frames.length; i++)
		if (window == rootWindow.frames[i]) return true;
	return false;
}
function CSOpenAlert(action) { alert(action[1]); }
// OUT Open Image Window Action v1.2.6
// Script copyright 1999, 2000 OUT Media Design GmbH. All rights reserved.
function OUTOpenImageWindow(action) {
	var imgWinW = action[3];
	var imgWinH = action[4];
	var bgImg = action[16] ? ' BACKGROUND="'+action[15]+'" ' : '';
	var bVers=window.navigator.appVersion.substring(0,1);
	var isMac = window.navigator.userAgent.indexOf("Mac") >= 0;
	var isNN = window.navigator.appName.indexOf("Netscape")>=0;
	var isIE = window.navigator.appName.indexOf("Explorer")>=0;
	var wOffset = (bVers<4 && isNN) ? 9 : action[14];
	imgWinW += 2*wOffset;
	imgWinH += 2*wOffset;
	var wf = "";	
	wf = wf + "width=" + imgWinW;
	wf = wf + ",height=" + imgWinH;
	wf = wf + ",resizable=" + (action[5] ? "no" : "yes");
	wf = wf + ",scrollbars=" + (action[6] ? "no" : "yes");
	wf = wf + ",menubar=" + (action[7] ? "no" : "yes");
	wf = wf + ",toolbar=" + (action[8] ? "no" : "yes");
	wf = wf + ",directories=" + (action[9] ? "no" : "yes");
	wf = wf + ",location=" + (action[10] ? "no" : "yes");
	wf = wf + ",status=" + (action[11] ? "no" : "yes");
	var newImgWin = window.open("",action[2],wf);
	newImgWin.saveResizable = !action[5];
	
	newImgWin.document.writeln('<HTML><HEAD><TITLE>'+action[13]+'</TITLE></HEAD>');
	newImgWin.document.writeln('<BODY BGCOLOR="'+action[12]+'"'+bgImg+' MARGINWIDTH="'+action[14]+'" MARGINHEIGHT="'+action[14]+'" LEFTMARGIN="'+action[14]+'" TOPMARGIN="'+action[14]+'">');
	newImgWin.document.write('<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="0" WIDTH="100%" HEIGHT="100%"><TR><TD VALIGN="middle" ALIGN="center"><IMG SRC="'+action[1]+'"');
	if (action[17] && bVers>=4) newImgWin.document.write(' ONLOAD="var imgWinW=this.width+'+2*wOffset+';var imgWinH=this.height+'+2*wOffset+';if(window.setResizable) window.setResizable(true);window.resizeTo(imgWinW, imgWinH);if (window.setResizable) window.setResizable(window.saveResizable);if(window.document.body && (window.document.body.clientWidth!=imgWinW || window.document.body.clientHeight!=imgWinH)) { window.resizeTo(2*imgWinW-window.document.body.clientWidth,2*imgWinH-window.document.body.clientHeight);}"');
	newImgWin.document.writeln('></TD></TR></TABLE>');
	newImgWin.document.writeln('</BODY></HTML>');
	newImgWin.document.close();
	if(bVers>=4 && !action[17]) { //do chrome compensation now
		if (isNN && newImgWin.setResizable) newImgWin.setResizable(true);
		if (!(isIE && isMac)) newImgWin.resizeTo(imgWinW,imgWinH);
		if (isNN && newImgWin.setResizable) newImgWin.setResizable(!action[5]);
		if(isIE && !isMac && (newImgWin.document.body.clientWidth!=imgWinW || newImgWin.document.body.clientHeight!=imgWinH)) newImgWin.resizeTo(2*imgWinW-newImgWin.document.body.clientWidth,2*imgWinH-newImgWin.document.body.clientHeight);
	}
	if(action[18] && bVers>=4 && !(isMac && isIE && bVers<5)) newImgWin.focus();
}
function CSOpenWindow(action) {
	var wf = "";	
	wf = wf + "width=" + action[3];
	wf = wf + ",height=" + action[4];
	wf = wf + ",resizable=" + (action[5] ? "yes" : "no");
	wf = wf + ",scrollbars=" + (action[6] ? "yes" : "no");
	wf = wf + ",menubar=" + (action[7] ? "yes" : "no");
	wf = wf + ",toolbar=" + (action[8] ? "yes" : "no");
	wf = wf + ",directories=" + (action[9] ? "yes" : "no");
	wf = wf + ",location=" + (action[10] ? "yes" : "no");
	wf = wf + ",status=" + (action[11] ? "yes" : "no");		
	window.open(action[1],action[2],wf);
}
function CSOpenWindowPrompt(action) {
var where = self.location.href
var nw = prompt("Enter a new width:","")
if (nw != null) {
var nh = prompt("Enter a new height:","")
}
var wf = "";	
wf = wf + "width=" + nw;
wf = wf + ",height=" + nh;
wf = wf + ",resizable=" + (action[1] ? "yes" : "no");
wf = wf + ",scrollbars=" + (action[2] ? "yes" : "no");
wf = wf + ",menubar=" + (action[3] ? "yes" : "no");
wf = wf + ",toolbar=" + (action[4] ? "yes" : "no");
wf = wf + ",directories=" + (action[5] ? "yes" : "no");
wf = wf + ",location=" + (action[6] ? "yes" : "no");
wf = wf + ",status=" + (action[7] ? "yes" : "no");		
	if (nw == null || nh == null) { 
	return null
	} else {
	window.open(where,'testwin',wf);
	}
}
// OUT Call Action Later Action Library 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
var OUTactsLater = new Array();
function OUTcallActionLater(action)
{
	for(var i=2;i<action.length;i++) {
		var a = new Array();
		a[0] = action[i];
		a[1] = setTimeout("CSAction(new Array('"+action[i]+"'))",action[1]);
		OUTactsLater[OUTactsLater.length]=a;
	}
}
// OUT Action Group Later Action 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTgroupActionLater(action) { OUTcallActionLater(action); }
// OUT Call Action OnBlur Library 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
var OUTactsOnBlur = new Array();
function OUTcallActionOnBlur(action)
{
	for(var i=1;i<action.length;i++) { OUTactsOnBlur[OUTactsOnBlur.length]=action[i]; }
	window.onblur=OUTexecBlurActions;
}
function OUTexecBlurActions() {
	for (var i=0;i<OUTactsOnBlur.length;i++) CSAction(new Array(OUTactsOnBlur[i]));
}
// OUT Action Group OnBlur Action 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTgroupActionOnBlur(action) { OUTcallActionOnBlur(action); }
// OUT Call Action OnFocus Library 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
var OUTactsOnFocus = new Array();
function OUTcallActionOnFocus(action)
{
	for(var i=1;i<action.length;i++) { OUTactsOnFocus[OUTactsOnFocus.length]=action[i]; }
	window.OnFocus=OUTexecFocusActions;
}
function OUTexecFocusActions() {
	for (var i=0;i<OUTactsOnFocus.length;i++) CSAction(new Array(OUTactsOnFocus[i]));
}
// OUT Action Group OnFocus Action 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTgroupActionOnFocus(action) { OUTcallActionOnFocus(action); }
// OUT Call Action OnResize Library 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
var OUTactsOnResize = new Array();
function OUTcallActionOnResize(action)
{
	for(var i=1;i<action.length;i++) { OUTactsOnResize[OUTactsOnResize.length]=action[i]; }
	window.onresize=OUTexecResizeActions;
}
function OUTexecResizeActions() {
	for (var i=0;i<OUTactsOnResize.length;i++) CSAction(new Array(OUTactsOnResize[i]));
}
// OUT Action Group OnResize Action 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTgroupActionOnResize(action) { OUTcallActionOnResize(action); }
// OUT Call Action OnScroll Action Library 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
var OUTactsOnScroll = new Array();
function OUTcallActionOnScroll(action)
{
	for(var i=1;i<action.length;i++) { OUTactsOnScroll[OUTactsOnScroll.length]=action[i]; }
	window.onscroll=OUTexecScrollActions;
	if (!IsIE()) {window.captureScrollEvent=OUTcaptureScrollEvent;window.OUTlastScrollX=0;window.OUTlastScrollY=0;setInterval(window.captureScrollEvent,10);}      
}
function OUTexecScrollActions() {
	for (var i=0;i<OUTactsOnScroll.length;i++) CSAction(new Array(OUTactsOnScroll[i]));
}
function OUTcaptureScrollEvent() {
	if (this.OUTlastScrollX!=window.pageXOffset||this.OUTlastScrollY!=window.pageYOffset) {
		this.onscroll();
	}
	this.OUTlastScrollX = window.pageXOffset;
	this.OUTlastScrollY = window.pageYOffset;
}
// OUT Action Group OnScroll Action 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTgroupActionOnScroll(action) { OUTcallActionOnScroll(action); }
// OUT Browser Test v1.3.1
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
var OUTuserAgent = window.navigator.userAgent; OUTappName = window.navigator.appName;
function OUTbrowserTest(action) {
	var OUTinnerW = window.innerWidth ? window.innerWidth : (document.body && document.body.clientWidth ? document.body.clientWidth : 0);
	var OUTinnerH = window.innerHeight ? window.innerHeight : (document.body && document.body.clientHeight ? document.body.clientHeight : 0);
	var OUTappVersion = (OUTuserAgent.indexOf("MSIE") >= 0) ? OUTuserAgent.substr(OUTuserAgent.indexOf("MSIE")+5,action[2].length) : OUTuserAgent.substr(OUTuserAgent.indexOf("Mozilla/")+8,action[2].length);
	var bOk = action[1]!='all' ? OUTappName.indexOf(action[1]) >= 0 : true;
	var vOk = action[2]!= '0'  ? eval(parseFloat(OUTappVersion)+action[4]+parseFloat(action[2])) : true;
	var pOk = action[3]!='all' ? OUTuserAgent.indexOf(action[3]) >= 0 : true;	
	var wOk = action[5]!='0' && window.screen ? eval(window.screen.width+action[6]+parseInt(action[5])) : true;
	var hOk = action[7]!='0' && window.screen ? eval(window.screen.height+action[8]+parseInt(action[7])) : true;
	var iwOk = action[9]!='0' && OUTinnerW ? eval(OUTinnerW+action[10]+parseInt(action[9])) : true;
	var ihOk = action[11]!='0' && OUTinnerH ? eval(OUTinnerH+action[12]+parseInt(action[11])) : true;
	if (bOk && vOk && pOk && wOk && hOk && iwOk && ihOk) return true;
	return false;
}
// OUT Call Action From URL Action 1.1
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
var OUTactsFromUrl = new Array();
function OUTcallActionFromURL(action)
{
	if (OUTactsFromUrl.length==0) { OUTcollectActionsFromURL();}
	for (var i in OUTactsFromUrl) CSAction(new Array(OUTactsFromUrl[i]));
}
function OUTcollectActionsFromURL() {
	var acts = OUTgetValuesFromURL("OUTcallAct");
    for (var i in acts) OUTactsFromUrl[OUTactsFromUrl.length]=acts[i][1];
}
OUTcollectActionsFromURL();
// OUT Call Action in Frame Action 1.0.1
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTcallActionInFrame(action)
{
	var actFrame = OUTFindFrame(action[2]);
	if (actFrame && actFrame.CSAction) actFrame.CSAction(new Array(action[1]));
}
// OUT Call Action Repeat Action Library 1.0
// Script copyright 2002, OUT Media Design GmbH. All rights reserved.
var OUTactsRepeat = new Array();
function OUTcallActionRepeat(action)
{
	var a = null, init = false;
	for(var i=0;i<OUTactsRepeat.length;i++) {
		if (OUTactsRepeat[i][0] == action[1]) {
			a = OUTactsRepeat[i];
			break;
		}
	}
	if (!a) {init=true;a = new Array(action[1],0); OUTactsRepeat[OUTactsRepeat.length]=a;} else {clearTimeout(a[1]);}
	a[1] = setTimeout("OUTcallActionRepeat(new Array(OUTcallActionRepeat,'"+action[1]+"',"+action[2]+","+action[3]+"))",OUTrandomBetween(action[2],action[3]));
	if (!init) CSAction(new Array(action[1]));
}
function OUTrandomBetween(min, max)
{
	return min + ((max - min) * Math.random());
}
// OUT Cancel Action Later 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTcancelActionLater(action)
{
	var timeoutID = 0;
	for (var i in OUTactsLater) { if (OUTactsLater[i][0]==action[1] || action[1]=='') clearTimeout(OUTactsLater[i][1]); }
}
// OUT Check Box Group Action 1.0
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
var OUTcheckBoxGroups = new Array();
function OUTinitCBGroup(action) {
	var cbGroup = null;
	if (!OUTcheckBoxGroups[action[1]]){
		OUTcheckBoxGroups[action[1]] = new Object();
		OUTcheckBoxGroups[action[1]].boxes = new Array();
		OUTcheckBoxGroups[action[1]].cboxes = new Array();
	}
	cbGroup = OUTcheckBoxGroups[action[1]];
	cbGroup.name = action[1];
	cbGroup.maxSelectable = action[2];
	cbGroup.msgPrefix = action[3];
	cbGroup.msgSuffix = action[4];
	cbGroup.reselect=action[5]==1;
	cbGroup.reset = OUTresetCBGroup;
	cbGroup.checked = OUTcheckedCBGroup;
	cbGroup.check = OUTaddCB;
	cbGroup.uncheck = OUTremoveCB;
	return true;
}
function OUTresetCBGroup() {
	for (var i=0; i < this.boxes.length; i++) { this.boxes[i].checked = false; }
}
function OUTcheckedCBGroup() {
	for (var i=0, cbCk =0; i < this.boxes.length; i++) { if (this.boxes[i].checked) cbCk++ ; } ; return cbCk;
}
function OUTremoveCB(cb) {
	var newCB = new Array();
	for (var i=0;i < this.cboxes.length; i++) { if (this.cboxes[i]!=cb) newCB[newCB.length]=this.cboxes[i]; }
	this.cboxes = newCB;
	cb.checked = false;
	return cb;
}
function OUTaddCB(cb) {
	if (this.checked() > this.maxSelectable) {
	    // Exceeded the limit
		if (this.reselect) {
			this.uncheck(this.cboxes[0]);
		} else {
			alert(this.msgPrefix+this.maxSelectable+this.msgSuffix);
			cb.checked = false;
			return cb;
		}
	}
	cb.checked = true;
	this.cboxes[this.cboxes.length] = cb;
	return cb;
}
// OUT Check Box Select Limit Action 1.0
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTlimitCheckedBoxes(action) {
	var cbGroup=null, theCheckBox = document.forms[action[1]].elements[action[2]];
	theCheckBox.OUTcbGroupN = action[3];
	if (!OUTcheckBoxGroups[action[3]]) OUTinitCBGroup(new Array(action[3],1,"",""));
	cbGroup = OUTcheckBoxGroups[action[3]];
	cbGroup.boxes[cbGroup.boxes.length] = theCheckBox;
	theCheckBox.OUTcbGroup = cbGroup;
//	cbGroup.reset();
	theCheckBox.onclick=OUTlimitCB;
	return true;
}
function OUTlimitCB() {
  // Limit the number of selected check boxes
	var theCheckBox = this;
	var cbGroup = theCheckBox.OUTcbGroup;
	if (theCheckBox.checked)
		cbGroup.check(theCheckBox);
	else
		cbGroup.uncheck(theCheckBox);
}
// OUT Move To Relative Position Library v 1.2.5
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
var CSIsW3CDOM = CSIsW3CDOM; // declare variable in case the NN6 Fix isn't installed
if(!CSIsW3CDOM) { CSIsW3CDOM = false; } // define in case the NN6 Fix isn't installed
function OUTcalcLyrRelPos(action)
{
	var x,y,w,h,ww,wh,lx,ly,xs,ys;
 	if (CSIsW3CDOM) {
 		CSIDOM();
		var lyr=document.getElementById(action[1]);
		x=parseInt(lyr.style.left); y=parseInt(lyr.style.top); w=parseInt(lyr.style.width); h=parseInt(lyr.style.height);
		xs=window.pageXOffset;ys=window.pageYOffset;
		ww=window.innerWidth; wh=window.innerHeight;
 	} else if (IsIE()) {
		var lyr=document.all.tags("div")[action[1]];
		x=lyr.offsetLeft; y=lyr.offsetTop; w=lyr.offsetWidth; h=lyr.offsetHeight;
		xs=document.body.scrollLeft;ys=document.body.scrollTop;
		ww=document.body.clientWidth; wh=document.body.clientHeight;
	} else {
		var lyr=CSNSStyl(action[1]);
		x=lyr.x; y=lyr.y; w=lyr.clip.width; h=lyr.clip.height;
		xs=window.pageXOffset;ys=window.pageYOffset;
		ww=window.innerWidth; wh=window.innerHeight;
	}
	var newX=x;
	var newY=y;
	lx = 0; ly = 0;
	if (action[2]==2) lx=Math.floor(w/2);
	if (action[2]==3) lx=w;
	if (action[3]==2) ly=Math.floor(h/2);
	if (action[3]==3) ly=h;
	if (action[2]) lx-=action[4];
	if (action[3]) ly-=action[5];
	if (action[6]==1) newX=action[8];
	if (action[6]==2) newX=ww/2;
	if (action[6]==3) newX=ww;
	if (action[7]==1) newY=action[9];
	if (action[7]==2) newY=wh/2;
	if (action[7]==3) newY=wh;
	if (action[6]) newX = OUTsnapPosToGrid(newX+xs,action[11],action[13],action[8]+xs-(action[10]?action[4]:0),ww+xs-action[8]-(action[10]?action[4]:0));
	if (action[7]) newY = OUTsnapPosToGrid(newY+ys,action[12],action[14],action[9]+ys-(action[10]?action[5]:0),wh+ys-action[9]-(action[10]?action[5]:0));
	return Array(newX-lx,newY-ly);
}
function OUTrelPosMod(x,y){return x-y*Math.floor(x/y);}
function OUTsnapPosToGrid(pos,grid,offset,min,max)
{
	pos = (min<max)?(pos>min?(pos<max?pos:max):min):pos;
	if (!grid) return pos;
	var newPos  = Math.floor((pos-offset)/grid)*grid;
	newPos += Math.round(OUTrelPosMod(pos-offset,grid)/grid)==1 ? grid : 0;
	newPos += offset;
	newPos = newPos >= min ? newPos : newPos+grid;
	newPos = newPos <= max ? newPos : newPos-grid;
	return newPos;
}
// OUT Get Relative Position Action v 1.0
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTgetRelPos(action)
{
	return OUTcalcLyrRelPos(action); 
}
// OUT Goto URL Action 1.1.5
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTgotoURL(action) {
	var frame = OUTFindFrame(action[2],0);
	if (frame) {
		var oldURL = frame.location.href;
		var newURL = action[1];
		if (action[1].indexOf("://")<0) {
			if (action[1].charAt(0)=='/') {
			 	newURL = window.location.protocol + "//" + window.location.host + action[1];
			} else {
				var up=0;var winURL = window.location.href;
				while (newURL.indexOf('../')==0) {newURL=newURL.substring(3,newURL.length);up++;}
				while (up) {winURL=winURL.substring(0,winURL.lastIndexOf('/'));up--;};
				newURL = winURL.substring(0,winURL.lastIndexOf('/')+1)+newURL;
			}
		}
		oldURL = action[3] ? oldURL : oldURL.substring(oldURL.lastIndexOf('/')+1,oldURL.length);
		newURL = action[3] ? newURL : newURL.substring(newURL.lastIndexOf('/')+1,newURL.length);
		oldURL = oldURL.substring(0,(!action[6]&&oldURL.indexOf('?')>0) ? oldURL.indexOf('?') : oldURL.length);
		newURL = newURL.substring(0,(!action[6]&&newURL.indexOf('?')>0) ? newURL.indexOf('?') : newURL.length);
		if (oldURL!=newURL) {
			action[4] ? frame.location.replace(action[1]) : (frame.location=action[1]);
			return frame;
		}
	} else
		return action[5] ? window.open (action[1],action[2]) : null;
}
// OUT List Box Selection Limit Action 1.0
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
// Original JavaScript by David Shadovitz
function OUTlistBoxLimit(action) {
	var listBox = document.forms[action[1]].elements[action[2]];
	listBox.OUTDSmaxSelectable = action[3];
	listBox.OUTDSprevSelected = new Array();
	listBox.OUTDSmsgPrefix  = action[4];
	listBox.OUTDSmsgSuffix = action[5];
	OUTDSresetListBox(listBox);
	listBox.onchange=OUTDSlimitSelect;
	return true;
}
/* 
 * The original JavaScript example was created by David Shadovitz for demonstration
 * in the Adobe GoLive Bible, a book written by Deborah Shadovitz and published by IDG Books.
 */
function OUTDSresetListBox(listBox) {
	for (var i=0; i < listBox.options.length; i++) {
		listBox.options[i].selected = false;
		listBox.OUTDSprevSelected[i] = false;
	}
}
function OUTDSlimitSelect() {
  // Limit the number of selections in a select box
	var listBox = this;
	var curSelected = new Array();
	var numSelected = 0;
	for (var i=0; i < listBox.options.length; i++) {
		curSelected[i] = listBox.options[i].selected;
		if (listBox.options[i].selected) { numSelected++ }
	}
	if (numSelected <= listBox.OUTDSmaxSelectable) {
    // Haven't yet exceeded the limit
		for (var i=0; i < listBox.options.length; i++) {
			listBox.OUTDSprevSelected[i] = curSelected[i];
		}
	} else {
    // Exceeded the limit
		alert(listBox.OUTDSmsgPrefix+listBox.OUTDSmaxSelectable+listBox.OUTDSmsgSuffix);
		for (var i=0; i < listBox.options.length; i++) {
			listBox.options[i].selected = listBox.OUTDSprevSelected[i];
		}
	}
}
// OUT Lock MenuMachine Library v1.0
// Script copyright 2002, OUT Media Design GmbH. All rights reserved.
function OUTinitLckMenuMachine(action,url) {
	var OUTlckMM=null;
	for (var i=0; !OUTlckMM && i<bbMenu.length; i++) {
		if (bbMenu[i].name == action[5])
			OUTlckMM = OUTlckMMGetMenu(bbMenu[i],url);
	}
	if (OUTlckMM) {
		OUTlckMM.OUTlckD = action[1];
		OUTlckMM.OUTlckH  = action[2];
		OUTlckMM.OUTlckDl = action[3]-1;
		OUTlckMM.OUTlckHl = action[4]-1;
		OUTlckMM.r.OUTlckMM = OUTlckMM;
		if (!OUTlckMM.r.mreset2) {
			OUTlckMM.r.mreset2 = OUTlckMM.r.mreset;
			OUTlckMM.r.mreset = OUTlckMMmreset;
		}
		OUTlckMM.r.mreset();
	}
}
function OUTlckMMGetMenu(m,u)
{
	var c = null;
	if (m.url && OUTlckMMCheckURL(m.url,u)) return m;
	for (var i=0; !c && m.c.length>i; i++) {
		c = OUTlckMMGetMenu(m.c[i],u);
	}
	return c;
}
function OUTabsoluteURL(u, b)
{
	var up=0;
	while (u.indexOf('../')==0) {u=u.substring(3,u.length);up++;}
	while (up) {b=b.substring(0,b.lastIndexOf('/'));up--;}
	u = b.substring(0,b.lastIndexOf('/')+1)+u;
	return u;
}
function OUTlckMMCheckURL(a,b)
{
	return OUTabsoluteURL(a, window.location.href) == b;
}
function OUTlckMMmreset()
{
	this.mreset2();
	if (this.OUTlckMM.OUTlckD) {
		var m = this.OUTlckMM; l = m.OUTlckDl;
		while (l>=0 && m.lvl>l) { m = m.par; }
		m.display(1,1);
	}
	if (this.OUTlckMM.OUTlckH) {
		var m = this.OUTlckMM, l = m.OUTlckHl;
		while (l>=0 && m.lvl>l) { m = m.par; }
		m.hilite(1,1);
	}
}
// OUT Lock MenuMachine Action v1.0
// Script copyright 2002, OUT Media Design GmbH. All rights reserved.
function OUTlckMenuMachine(action) {
	OUTinitLckMenuMachine(action,document.location.href);
}
// OUT Lock MenuMachine in Frame Action v1.0
// Script copyright 2002, OUT Media Design GmbH. All rights reserved.
function OUTlckMenuMachineFrm(action) {
	var lckTarget = null;
	if (action[6]=='') lckTarget = window; else lckTarget = OUTFindFrame(action[6],0);
	if (lckTarget && lckTarget.bbMenu && lckTarget.OUTinitLckMenuMachine){
		lckTarget.OUTinitLckMenuMachine(action,document.location.href);;
		return true;
	}
	return false;
}
// OUT Lock Rollover Action v1.4
// Script copyright 1999-2002, OUT Media Design GmbH. All rights reserved.
function OUTlckBtnIm(action) {
	return OUTdoLckBtnIm(action,false);
}
// OUT Lock Rollover in Frame Action v1.4
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTlckBtnImFrm(action) {
	var lckTarget = null;
	if (action[3]=='') lckTarget = window; else lckTarget = OUTFindFrame(action[3],0);
	if (action[4]) {//automatic
		var docDir = window.location.pathname;
		var lckBtn = '';
		if (action[1]) docDir=docDir.substring(docDir.indexOf(action[1])+action[1].length,docDir.length);
		docDir=docDir.substring(docDir.charAt(0)=='/'?1:0,docDir.lastIndexOf('.')>0?docDir.lastIndexOf('.'):docDir.length);
		docDir=docDir.split('/');
		if(!action[6]) docDir.length-=1;
		if(docDir.length){
			if(action[4]==1) lckBtn=docDir[0];
			if(action[4]==2) lckBtn=docDir[docDir.length-1];
			if(action[4]==3) {for(var i=0; i<docDir.length; i++){lckBtn+=docDir[i];if(i<docDir.length-1)lckBtn+=action[5];}}
		}
		action[1]=lckBtn;
	}
	if (lckTarget && lckTarget.CSIShow && lckTarget.OUTdoLckBtnIm){
		action[3] = action[8]? true : false; //copy params to correct position
		lckTarget.OUTdoLckBtnIm(action,action[7]);
		return true;
	}
	return false;
}
// OUT Lock Rollover Toggle Action v1.1
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTlckBtnImTgl(action) {
	var g = OUTlckGrpName(action[2]);
	if (OUTlckIm[g] && OUTlckIm[g].name==action[1]) action[1]="";
	return OUTdoLckBtnIm(action,false);
}
// OUT Mouse Trail Library v 1.1.1
// Script copyright 1999, OUT Media Design GmbH. All rights reserved.
var OUTmtL=new Array;
var OUTie=IsIE();
var OUTmtOk = CSBVers > 3;
var OUTie5fix1=0;
var OUTie5fix2=0;
var OUTmtXpos=0;
var OUTmtYpos=0;
function OUTmtLsetPos(x,y)
{
	this.lastX=this.x;this.lastY=this.y;this.x=(x-this.mtXoff)*this.mtXfac+this.mtXoff;this.y=(y-this.mtYoff)*this.mtYfac+this.mtYoff;
}
function OUTmtMinMaxX()
{
	return (this.h?this.x<this.x1?this.x1:this.x>this.x2?this.x2:this.x:this.x)+this.dx;
}
function OUTmtMinMaxY()
{
	return (this.v?this.y<this.y1?this.y1:this.y>this.y2?this.y2:this.y:this.y)+this.dy; 
}
function OUTmtMinMaxXval(x)
{
	return (this.h?x<this.x1?this.x1:x>this.x2?this.x2:x:x)+this.dx;
}
function OUTmtMinMaxYval(y)
{
	return (this.v?y<this.y1?this.y1:y>this.y2?this.y2:y:y)+this.dy; 
}
function OUTmtSetInterval()
{
	this.intervalID=clearTimeout(this.intervalID);
	this.intervalID=setTimeout(this.movef+'("'+this.name+'")',this.rate);
}
function OUTmouseTrailer(mf,n,r,s,h,v,x1,x2,y1,y2,c,ht,dx,dy,ox,oy,fx,fy)
{
	this.movef=mf;this.name=n;this.rate=r;this.sequence=s;this.v=v;this.h=h;this.x1=x1;this.x2=x2;this.y1=y1;this.y2=y2;this.showcoords=c;this.keepRelDist=ht;
	this.x=CSGetStylePos(this.name,0);this.y=CSGetStylePos(this.name,1);this.lastX=this.x;this.lastY=this.y;this.dX=0;this.dY=0;
	this.setPos=OUTmtLsetPos;this.rX=OUTmtMinMaxX;this.rY=OUTmtMinMaxY;this.rvalX=OUTmtMinMaxXval;this.rvalY=OUTmtMinMaxYval;this.dx=dx;this.dy=dy;
	this.mtSetInterval=OUTmtSetInterval;this.intervalID=0;this.mtSetInterval();
	this.mtXoff=ox;this.mtYoff=oy;this.mtXfac=fx;this.mtYfac=fy;
}
function OUTinitMouseTrail(curMT)
{
	if (!curMT) return;
	if (OUTmtOk) {
		OUTmtL[OUTmtL.length]=curMT;
		OUTmtL.sort(OUTcompMT)
		for (var i=0; i<OUTmtL.length; i+=1) {
			if (i>0) {
				OUTmtL[i].dX=OUTmtL[i].x-OUTmtL[i-1].x;
				OUTmtL[i].dY=OUTmtL[i].y-OUTmtL[i-1].y;
			} else {
				OUTmtL[i].dX=OUTmtL[i].x;
				OUTmtL[i].dY=OUTmtL[i].y;
			}
		}
		if(!OUTie) document.captureEvents(Event.MOUSEMOVE);
		document.onmousemove=OUTmtNewPos;
	}
}
function OUTcompMT(a, b) {
   return a.sequence - b.sequence
}
function OUTmtMove(n)
{
	var curMt=null;
	var i=0;
	for (i=0; i<OUTmtL.length;i+=1) {
		if (OUTmtL[i].name==n){curMt=OUTmtL[i]; break;};
	}
	if(!curMt) return null;
	if(curMt.showcoords) self.status="x: "+((OUTmtXpos-curMt.mtXoff)*curMt.mtXfac)+", y: "+((OUTmtYpos-curMt.mtYoff)*curMt.mtYfac);
	if(OUTie && document.body.scrollLeft!=null){OUTie5fix1=document.body.scrollLeft;OUTie5fix2=document.body.scrollTop;}
	if (0 < i) {
		if(curMt.keepRelDist){xPos=OUTmtL[i-1].x+curMt.dX;yPos=OUTmtL[i-1].y+curMt.dY;}
		else{xPos=OUTmtL[i-1].lastX;yPos=OUTmtL[i-1].lastY;}
	} else{xPos=OUTmtXpos;yPos=OUTmtYpos;}
	curMt.setPos(xPos,yPos);
	return curMt;
}
function OUTmtNewPos(e)
{
	OUTmtXpos = OUTie ? event.clientX+OUTie5fix1 : e.pageX;
	OUTmtYpos = OUTie ? event.clientY+OUTie5fix2 : e.pageY;
}
// OUT Mouse Trail Jump Action v 1.1.2
// Script copyright 1999-2002, OUT Media Design GmbH. All rights reserved.
function OUTinitMTjump(a)
{
	if (a[1]=='') return;
	myMT=new OUTmouseTrailer("OUTmtJumpMove",a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15],a[16],a[17]);
	OUTinitMouseTrail(myMT);
}
function OUTmtJumpMove(n)
{
	var curMt=OUTmtMove(n);
	if(!curMt) return;
	CSSetStylePos(curMt.name,0,curMt.rX());
	CSSetStylePos(curMt.name,1,curMt.rY());
	curMt.mtSetInterval();
}
// OUT Mouse Trail Multi Action v 1.0.3
// Script copyright 1999-2002, OUT Media Design GmbH. All rights reserved.
function OUTinitMTmulti(a)
{
	if (a[1]=='') return;
	myMT=new OUTmouseTrailer("OUTmtMultiMove",a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],0,0,1,1);
	myMT.master=a[14];
	myMT.method=a[15];
	myMT.xBase=a[16];
	myMT.yBase=a[17];
	myMT.step=0.2;
	myMT.currStep=0;
	OUTinitMouseTrail(myMT);
}
function OUTmtMultiMove(n)
{
	var curMt=OUTmtMove(n);
	if(!curMt) return;
	switch(curMt.method) {
		case 0: {
			CSSetStylePos(curMt.name,0,curMt.rX());
			CSSetStylePos(curMt.name,1,curMt.rY());
			break;
		}
		case 1: {
			CSSlideLayer(curMt.name,new Array(curMt.rX(),curMt.rY()),1,curMt.rate/10);
			break;
		}
		case 2: {
			var currStep = curMt.currStep;
			var step = curMt.step;
			var s=curMt.sequence;
			var xPos = curMt.x + Math.sin((20*Math.sin(currStep/20))+s*70)*curMt.xBase*(Math.sin(10+currStep/10)+step)*Math.cos((currStep + s*25)/10);
			var yPos = curMt.y + Math.cos((20*Math.sin(currStep/20))+s*70)*curMt.yBase*(Math.sin(10+currStep/10)+step)*Math.cos((currStep + s*25)/10);
			CSSetStylePos(curMt.name,0,curMt.rvalX(xPos));
			CSSetStylePos(curMt.name,1,curMt.rvalY(yPos));
			if (curMt.isMaster) curMt.setPos(xPos,yPos);
			curMt.currStep += curMt.step;
			break;
		}
	}
	curMt.mtSetInterval();
}
// OUT Mouse Trail Orbit Action v 1.0.3
// Script copyright 1999-2002, OUT Media Design GmbH. All rights reserved.
function OUTinitMTorbit(a)
{
	if (a[1]=='') return;
	myMT=new OUTmouseTrailer("OUTmtOrbitMove",a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],0,0,1,1);
	myMT.master=a[14];
	myMT.step=a[17];
	myMT.currStep=0;
	myMT.xBase=a[15];
	myMT.yBase=a[16];
	OUTinitMouseTrail(myMT);
}
function OUTmtOrbitMove(n)
{
	var curMt=OUTmtMove(n);
	if(!curMt) return;
	var currStep = curMt.currStep;
	var step = curMt.step;
	var s=curMt.sequence;
	var xPos = curMt.x + Math.sin((20*Math.sin(currStep/20))+s*70)*curMt.xBase*(Math.sin(10+currStep/10)+step)*Math.cos((currStep + s*25)/10);
	var yPos = curMt.y + Math.cos((20*Math.sin(currStep/20))+s*70)*curMt.yBase*(Math.sin(10+currStep/10)+step)*Math.cos((currStep + s*25)/10);
	CSSetStylePos(curMt.name,0,curMt.rvalX(xPos));
	CSSetStylePos(curMt.name,1,curMt.rvalY(yPos));
	if (curMt.isMaster) curMt.setPos(xPos,yPos);
	curMt.currStep += curMt.step;
	curMt.mtSetInterval();
}
// OUT Mouse Trail Slide Action v 1.1.1
// Script copyright 1999-2002, OUT Media Design GmbH. All rights reserved.
function OUTinitMTslide(a)
{
	if (a[1]=='') return;
	myMT=new OUTmouseTrailer("OUTmtSlideMove",a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15],a[16],a[17]);
	OUTinitMouseTrail(myMT);
}
function OUTmtSlideMove(n)
{
	var curMt=OUTmtMove(n);
	if(!curMt) return;
	CSSlideLayer(curMt.name,new Array(curMt.rX(),curMt.rY()),1,curMt.rate/10);
	curMt.mtSetInterval();
}
// OUT Move To Relative Position Action v 1.0
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTmoveToRelPos(action)
{
	CSSlideLayer(action[1],OUTcalcLyrRelPos(action),action[15],action[16]);
}
function OUTCSFixFct() {
	var d = document; var w = window;
	if (d.cs.csFix.w != w.innerWidth || d.cs.csFix.h != w.innerHeight) {
		d.location = d.location; }
}
function OUTCSNSFix(action) { 
	var d = document; var w = window;
	if ((navigator.appName == 'Netscape') && (parseInt(navigator.appVersion) == 4)) {
		if (typeof d.cs == 'undefined') { 
			d.cs = new Object;
			d.cs.csFix = new Object; 
		} else if (OUTCSIsFrame (w) == true || action[1]) OUTCSFixFct();
		d.cs.csFix.w = w.innerWidth;
		d.cs.csFix.h = w.innerHeight; 
		if (!action[1])  window.onresize = OUTCSFixFct;
	  }
}
function OUTCSIsFrame (window) {
	var rootWindow = window.parent;
	if (rootWindow == 'undefined') return false;
	for (i = 0; i < rootWindow.frames.length; i++)
		if (window == rootWindow.frames[i]) return true;
	return false;
}
// OUT Play Sound Action
// Script copyright 1999, OUT Media Design GmbH. All rights reserved.
var CSLastSound = null;
function OUTPlaySound(action) {
	if (eval('document.'+action[1])!=null) {
		if (CSLastSound != null && CSLastSound != action[1]) {
			if (window.navigator.userAgent.indexOf("MSIE") < 0)
//forget sound in IE
				eval ('document.' + action[1] + '.stop()');		
		}
		CSLastSound = action[1]
		if (window.navigator.userAgent.indexOf("MSIE") > 0)
//forget sound in IE			eval ('document.' + CSLastSound + '.run()');
;
		else
			eval ('document.' + CSLastSound + '.play(true)');
	}
}
// OUT PNG library 1.0.7
// Script copyright 2004 OUT Media Design GmbH. All rights reserved.
function OUTpngBrowserCheck(){
// Code partially taken from:
// Browser Detect Lite  v2.1 <http://www.dithered.com/javascript/browser_detect/index.html>
// modified by Chris Nott (chris@NOSPAMdithered.com - remove NOSPAM)
// modified by Oliver Zahorka
	var ua=navigator.userAgent.toLowerCase(); 
	this.ua=ua;
	// browser name
	this.isGecko=(ua.indexOf('gecko')>=0);
	this.isMozilla=(this.isGecko && ua.indexOf("gecko/")+14 == ua.length);
	this.isNS=((this.isGecko)?(ua.indexOf('netscape')>=0):((ua.indexOf('mozilla')>=0) && (ua.indexOf('spoofer')<0) && (ua.indexOf('compatible')<0) && (ua.indexOf('opera')<0) && (ua.indexOf('webtv')<0) && (ua.indexOf('hotjava')<0)));
	this.isIE=((ua.indexOf("msie")>=0) && (ua.indexOf("opera")<0) && (ua.indexOf("webtv")<0)); 
	this.isOpera=(ua.indexOf("opera")>=0); 
	this.isAol=(ua.indexOf("aol")>=0); 
	// browser version
	this.vers=parseFloat(navigator.appVersion); 
	// correct version number for NS6+ 
	if (this.isNS && this.isGecko){this.vers=parseFloat(ua.substring(ua.lastIndexOf('/')+1));}
	// correct version number for IE4+ 
	else if (this.isIE && this.vers >= 4){this.vers=parseFloat(ua.substring(ua.indexOf('msie ')+5));}
	// correct version number for Opera 
	else if (this.isOpera){if (ua.indexOf('opera/')>=0){this.vers=parseFloat(ua.substring(ua.indexOf('opera/')+6));}else{this.vers=parseFloat(ua.substring(ua.indexOf('opera ')+6));}}
	// platform
	this.isWin  =(ua.indexOf('win')>=0);
	this.isMac  =(ua.indexOf('mac')>=0);
	this.isUnix =(ua.indexOf('unix')>=0 || ua.indexOf('linux')>=0 || ua.indexOf('sunos')>=0 || ua.indexOf('bsd')>=0 || ua.indexOf('x11')>=0)
}
function OUTcheckPNGSupport()
{
	var b=new OUTpngBrowserCheck();
	// support for PNG via AlphaImageLoader, if is IE5.5+ on windows; set flag to 1
	if (b.isIE && b.vers>=5.5) return 1;
	// no support for PNG; set flag to -1 for Opera < 6 on Win/Unix, Opera < 5 on Mac, Netscape < 5, AOL
	else if ((b.isIE && b.isWin) || (b.isIE && b.isMac && b.vers < 5) || (b.isOpera && (b.isWin || b.isUnix) && b.vers < 6) || (b.isOpera && b.isMac && b.vers < 5) || (b.isNS && b.vers < 5) || b.isAol) return -1;
	// support for PNG right away; set flag to 0 for all others
	else return 0;
}
var OUTpngSupport=OUTcheckPNGSupport();
function OUTisPNGsrc(s,n){s=s.toLowerCase();n="."+n.toLowerCase();return s.lastIndexOf(n)==(s.length-n.length);}
function OUTpngImgReplace(img,isrc,psrc,rsrc){
	if (OUTpngSupport>0 && psrc && psrc!="#" && isrc && isrc!="#"){
		img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+isrc+"', sizingMethod='scale')";
		img.src=psrc;
	}
	if(OUTpngSupport<0 && rsrc && rsrc!="#"){img.src=rsrc;}
	if(OUTpngSupport==0 && isrc && isrc!="#" && img.src!=isrc){img.src=isrc;}
}
function OUTpngCSILoadTrans(s) {if(typeof(CSIm)!="undefined"){for(var n in CSIm){CSIm[n][4]=new Image();CSIm[n][4].src=s;}}}
function OUTpngCSIShow(n,i) {
	if (document.images) {
		if (CSIm[n]) {
			var img=CSGetImage(n);
			if (img&&typeof(CSIm[n][i].src)!="undefined") {
				if(!OUTisPNGsrc(CSIm[n][i].src,"png")) img.src=CSIm[n][i].src;
				else OUTpngImgReplace(img,CSIm[n][i].src,CSIm[n][4].src,"#")
			}
			if(i!=0) self.status=CSIm[n][3]; else self.status=" ";
			return true;
		}
	}
	return false;
}
function OUTpngRolloverInit(a) {OUTpngCSILoadTrans(a[1]); if(typeof(CSIShow)!="undefined" && OUTpngCSIShow)CSIShow=OUTpngCSIShow;}
//
// OUT PNG Image Replace 1.0.0
// Script copyright 2004 OUT Media Design GmbH. All rights reserved.
function OUTpngImgReplAct(a) {
	var img=CSGetImage(a[3]);
	if(img&&OUTisPNGsrc(img.src,a[2]))OUTpngImgReplace(img,img.src,a[1],a[4]);
}
//
//-->
// OUT PNG MenuMachine 1.0.0
// Script copyright 2004 OUT Media Design GmbH. All rights reserved.
function OUTpngMenuMachineInit() {
	if(OUTpngSupport>0) __menu.prototype.hilite=OUTpngMMhilite;
}
function OUTpngMMhilite(on,r){var m=this;if(_b.n4){m.o.ocss.visibility=on?_b.show:_b.hide;}else{if(m.overUrl){if (OUTisPNGsrc(on?m.overUrl:m.imgUrl,"png")) OUTpngImgReplace(m.img,(on?m.overUrl:m.imgUrl),m.r.spc,"#");else m.img.src=on?m.overUrl:m.imgUrl;}if(m.opaque){if(_b.op)m.o.ncss.background=on?m.bgOverColor:m.bgcolor;else{m.o.ncss.backgroundColor=on?m.bgOverColor:m.bgcolor}}m.o.ncss.color=on?m.foc:m.fc;}m.hi=on;if(m.r.nhlP&&on&&r&&m.lvl>0)m.par.hilite(1,1);}
//
//-->
// OUT PNG Transparency for IE 1.0.6
// Script copyright 2004 OUT Media Design GmbH. All rights reserved.
function OUTpngIEBgReplace(style,s,m){
	style.backgroundImage="";
	style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+s+"', sizingMethod='"+m+"')";
}
function OUTiePNGimgXparency(a) {
	/* check browser */
	if (OUTpngSupport>0){
		/* add Smart Rollover support */
		OUTpngRolloverInit(a);
		/* replace img */
		if(document.images){
			for (var i=0;i<document.images.length;i++) {
				var img=document.images[i];
				if(img&&OUTisPNGsrc(img.src,a[2]))OUTpngImgReplace(img,img.src,a[1],"#");
			}
		}
		/* replace style backgrounds */
		if (a[3] && document.all) {
			for(var i=0;i<document.all.length;i++){
			 	var e=document.all[i],s=null;
			 	if (e.background) s=e.background;
			 	else if (e.style && e.style.backgroundImage) {
			 		s=e.style.backgroundImage;
			 		s=s.substr(4,s.length-5);
			 	}
			 	if(s&&OUTisPNGsrc(s,a[2])){e.background="";OUTpngIEBgReplace(e.style,s,a[4]);}
			}
		}
		/* replace css backgrounds */
		if (a[5] && document.styleSheets) {
			for (var j=0; j<document.styleSheets.length; j++){
				for(var i=0;i<document.styleSheets[j].rules.length;i++){
				 	var e=document.styleSheets[j].rules[i],s=null;
				 	if (e.style && e.style.backgroundImage) {
				 		s=e.style.backgroundImage;
				 		s=s.substr(4,s.length-5);
				 	}
				 	if(s&&OUTisPNGsrc(s,a[2]))OUTpngIEBgReplace(e.style,s,a[6]);
				}
			}
		}
	}
}
//
//-->
// OUT Set Rollover Action In Frame
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTsetBtnIm(action) {
	if (window.CSIShow){
		window.CSIShow(action[1], action[2]);
		return true;
	}
	return false;
}
// OUT Set Rollover Image Action
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTsetBtnImURL(action) {
	if (window.CSILoad){
		if (action[1] != '') { CSIm[action[1]][action[2]].src = action[3]; }
		return true;
	}
	return false;
}
// OUT Set Rollover Action In Frame
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTsetBtnImInFrame(action) {
	var btnFrame = action[3]=='' ? window : OUTFindFrame(action[3],0);
	if (btnFrame && btnFrame.CSIShow){
		btnFrame.CSIShow((action[4] ? OUTfindComponentElementName(action[1]) : action[1]), action[2]);
		return true;
	}
	return false;
}
// OUT Shake Window Action 1.2
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
function OUTinitShakeWin(action) {
	if (IsIE() ? CSBVers>=4 : window.top.moveBy!=null) {
		window.OUTwinShake=new Array();
		window.OUTwinShake.repeat=action[1];window.OUTwinShake.distance=action[2];window.OUTwinShake.vibrate=action[3];	
		window.OUTwinShake.up=action[4];window.OUTwinShake.down=action[5];window.OUTwinShake.left=action[6];window.OUTwinShake.right=action[7];
		window.OUTwinShake.time=action[8];
		if (action[9]) window.OUTwinShake.timeout=setTimeout("OUTshakeWin()", action[9]);
		else { window.OUTwinShake.timeout=0; OUTshakeWin(); }
	}
}
function OUTshakeWin() {
	var a=window.OUTwinShake;
	clearTimeout(a.timeout);
	if (IsIE() ? CSBVers>=4 : window.top.moveBy!=null) {
		for (i = a.distance; i > 0; i--) {
			if (a.up) window.top.moveBy(0,-i);
			if (a.left) window.top.moveBy(-i,0);
			if (a.up || a.down) window.top.moveBy(0, a.up && a.down? i*2 : i);
			if (a.left || a.right) window.top.moveBy(a.left && a.right? i*2 : i,0);
			if (a.down) window.top.moveBy(0,-i);
			if (a.right) window.top.moveBy(-i,0);
			if (!a.vibrate) break;
  		}    
		if (a.repeat) {
			a.repeat--;
			a.timeout=setTimeout("OUTshakeWin()", window.OUTwinShake.time)
		}
	}
}
// OUT Stop Action Repeat 1.0
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTstopActionRepeat(action)
{
	var timeoutID = 0;
	for (var i in OUTactsRepeat) { if (OUTactsRepeat[i][0]==action[1] || action[1]=='') clearTimeout(OUTactsRepeat[i][1]); }
}
// OUT Stop Sound Action
// Script copyright 1999, OUT Media Design GmbH. All rights reserved.
function OUTStopSound (action) {
	if (eval('document.'+action[1])!=null) {
		if (window.navigator.userAgent.indexOf("MSIE") < 0)
//forget sound in IE
			eval ('document.' + action[1] + '.stop()');		
	}
}
// OUT Text Input Count Limit Action 1.0
// Script copyright 2000, OUT Media Design GmbH. All rights reserved.
// CharCount and countReturnKey originally by SWang, 12/06/99
function OUTfieldCount(action) {
	var textField = document.forms[action[1]].elements[action[2]];
	textField.OUTmaxChar = action[3];
	textField.OUTmsgPrefix  = action[4];
	textField.OUTmsgSuffix = action[5];
	textField.OUTshowCharMethod = action[6]
	textField.OUTshowCharLeftStatus=action[7];
	textField.OUTshowCharLeftField=action[8];
	textField.OUTcharLeftField=action[9] ? document.forms[action[1]].elements[action[9]] : null;
	textField.onkeyup=OUTcharCount;
	return true;
}
//--------------------------------------
// Functions implemented for counting
// characters in the textarea,text_area.
// This implementation works only for
// IE 4.0+ and Netscape 4.0+.
// SWang01, 12-99-06---------------start
function OUTcharCount(){
	var textField = this;
	var txtString=textField.value;
	var rkCount=OUTcountReturnKey(txtString);
	var strLength=txtString.length-rkCount;
	if (strLength>textField.OUTmaxChar){
		alert(textField.OUTmsgPrefix+textField.OUTmaxChar+textField.OUTmsgSuffix)
		textField.value=txtString.substring(0,textField.OUTmaxChar + rkCount);
		strLength=textField.value.length-rkCount;
	}
//	strLength = (txtString.charAt(txtString.length-1)!="\n") ? strLength : strLength-1;
	var charLeft = textField.OUTshowCharMethod ? textField.OUTmaxChar-strLength : strLength;
	if (textField.OUTshowCharLeftStatus) window.status=charLeft;
	if (textField.OUTshowCharLeftField) textField.OUTcharLeftField.value=charLeft;
}
function OUTcountReturnKey(data){
	var rkCount=0, dataLength=data.length;
	for (var i=0; i<dataLength;i++){
		if (data.charAt(i)=="\r") rkCount++;
	}
	return rkCount;
}
// SWang01, 12-99-06-----------------end
// OUT Lock Rollover Action
// Script copyright 2001, OUT Media Design GmbH. All rights reserved.
function OUTunlckBtnIm(action) {
	action[2] = action[1];
	action[1] = "";
	return OUTdoLckBtnIm(action,false);
}
var actn1 = "";
var actn2 = "";
var pass=""
var z=23;
var y=28;
iCounter = 3;
if (Array) {
	var f= new Array();
	var K= new Array();
	var base= new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z","a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z")
} 
function inc(){
iCounter--
if (iCounter > 0)
	{
	if (confirm("\nPassword is incorrect.\n\n\n\nRetry?"))
		Check()
	} 
	else
		alert('Access Denied');
} 
function Check(){
pass = prompt("Enter your password.","")
if(pass==null || pass==""){
	alert("You did not enter a password!");
	if(pass==""){
		Check()
	} 
} 
else{
	var lpass=(pass.length)+1
	for (l=1; l<lpass; l++){
		K[l]=pass.charAt(l)
	} 
	var transmit=0;
	for (y=1; y<lpass; y++){
		for(x=0; x<62; x++){
			if (K[y]==base[x]){
				transmit+=f[x]
				transmit*=y
			} 
		} 
	} 
	if (transmit==parseInt(actn1)) 	
		go()
	else
		inc()
} 
} 
function go(){
alert(actn2);
location.href=pass+".html";
} 
function PVpassword(action) { 
if (Array) { 
	actn1 = action[1];
	actn2 = action[2];
	z=23;
	y=28;
	for (x=0; x<10; x++){
		f[x]=x<<9
		f[x]+=23
	} 
	for (x=10; x<36; x++){
		y=y<<1
		v= Math.sqrt(y)
		v = parseInt(v,16)
		v+=5
		f[x]=v
		y++
	} 
	for (x=36; x<62; x++){
		z=z<<1
		v= Math.sqrt(z)
		v = parseInt(v,16)
		v+=74
		f[x]=v
		z++
	} 
	iCounter = 3;
	Check();
} 
}
function CSPDFredirect(action) {    
    if(navigator.mimeTypes && navigator.mimeTypes["application/pdf"] && navigator.mimeTypes["application/pdf"].enabledPlugin) {
		location.href=action[1]
	}
    else if (navigator.appName == "Microsoft Internet Explorer") {
       	x = confirm("The page you are trying to view requires the Adobe Portable Document Format (.PDF) browser plug-in or the Adobe Acrobat Reader application. We could not detect if your browser has this plug-in installed. To attempt to view the page anyway, click OK. Otherwise click CANCEL to view an alternate page")
		if (x == true)  location.href=action[1] 
    }
	else {
		x = confirm("Your browser may not be able to display PDF files. To attempt to view the PDF page anyway, click OK. Otherwise click CANCEL to view an alternate page")
		if (x == true)  location.href=action[1] 
	}         
}
function ROPlayClip (act) {
	var i,url,clipinfo,related_info_url,width,height,media_browser_url,target,delay,bnow_playing;
	url=act[1];
	related_info_url=act[2];
	if(related_info_url=="(EmptyReference!)")related_info_url="";
	width=act[3];
	height=act[4];
	media_browser_url=act[5];
	if(media_browser_url=="(EmptyReference!)")media_browser_url="";
	if(act[6]==0)target="_rpbrowser";
	else target="_rpexternal";
	delay=act[7]*1000;
	if(delay>0) {
		var obj=new Object();
		obj.type="navigate";
		obj.time=delay;
		obj.url=media_browser_url;
		media_browser_url="";
		obj.target=target;
		if(ROOnPLCArray)
			ROOnPLCArray[ROOnPLCArray.length]=obj;
	}
	bnow_playing=act[8];
	clipinfo="Album name="+act[9];
	clipinfo+="|Artist name="+act[10];
	clipinfo+="|CDNum="+act[11];
	clipinfo+="|Comments="+act[12];
	clipinfo+="|Genre="+act[13];
	clipinfo+="|Language="+act[14];
	clipinfo+="|Mood="+act[15];
	clipinfo+="|Preference="+act[16];
	clipinfo+="|Situation="+act[17];
	clipinfo+="|Title="+act[18];
	clipinfo+="|Year="+act[19];
	window.parent.external.PlayClip (url,clipinfo,related_info_url,width,height,media_browser_url,target,bnow_playing);
}
function CSPlayScene(action) { CSStartSeq (action[1]); }
var CSLastSound = null
function CSPlaySound(action) {
	if (eval('document.'+action[1])!=null) {
		if (CSLastSound != null && CSLastSound != action[1]) eval ('document.' + CSLastSound + '.stop()');
		CSLastSound = action[1]
		if (window.navigator.userAgent.indexOf("MSIE") > 0) eval ('document.' + CSLastSound + '.run()');
		else eval ('document.' + CSLastSound + '.play(true)');
	} else { alert ("The current Plug-In cannot be controlled by JavaScript. Please try using LiveAudio or a compatible Plug-In!"); }
}
CSImages=new Array();
function CSPreloadImage(action) {
	if (document.images) { CSImages[CSImages.length]=new Image(); CSImages[CSImages.length-1].src=action[1]; }
}
function ROPreloadURL (act) {
	ROPreloadURLArray[ROPreloadURLArray.length]=act[1];
}
ROPreloadURLArray=new Array();
function RPOnPreload() {	/* RO-Event-Handler */
	for(var i=0;i<ROPreloadURLArray.length;i++) {
		if (ROPreloadURLArray[i] != 0) {
			window.parent.external.PreloadURL(ROPreloadURLArray[i]);
			ROPreloadURLArray[i]=0;
		}
	}
}
function CSprintdocument(action){
if (navigator.appName .indexOf("Microsoft") != -1 && navigator.platform.indexOf("Mac") != -1 || navigator.appVersion.indexOf("3.0") != -1) {
alert("Please use your browser\'s print command to print this document.");
	} else {
	(action[1] != "") ? (parent.frames[action[1]].print()) : (parent.print());
	}
}
function CSRandomLinks(action){
var urlcounter = 0;
if (action[2] != "(Empty Reference!)" && action[2] != "(EmptyReference!)") { ++urlcounter};
if (action[3] != "(Empty Reference!)" && action[3] != "(EmptyReference!)") { ++urlcounter};
if (action[4] != "(Empty Reference!)" && action[4] != "(EmptyReference!)") { ++urlcounter};
if (action[5] != "(Empty Reference!)" && action[5] != "(EmptyReference!)") { ++urlcounter};
if (action[6] != "(Empty Reference!)" && action[6] != "(EmptyReference!)") { ++urlcounter};
if (action[7] != "(Empty Reference!)" && action[7] != "(EmptyReference!)") { ++urlcounter};
if (parent.frames.length > 0) {
if (action[1].length > 0) { parent.frames[action[1]].location=action[Math.floor(Math.random()*urlcounter)+2] }
}
else 
if (action[1].length > 0) { window.open(action[Math.floor(Math.random()*urlcounter)+2],action[1],"") }	
if (action[1].length == 0) { top.location=action[Math.floor(Math.random()*urlcounter)+2] }
}
function CSRandomImg(action) { 
	var img = CSGetImage(action[1]);
	if (img) 
		{
		var v1 =  Math.floor(Math.random() * 10);
		var whichone = v1-(Math.floor(v1/3)*3);
		img.src = action[whichone+2];
		}
}
function getCookie(thecookie){
	tempString= thecookie + "=";
	if(document.cookie.length>0){
		start = document.cookie.indexOf(tempString);
		if(start!=-1){
			end = document.cookie.indexOf(";",start);
			if(end==-1){end=document.cookie.length;}
			start += tempString.length;
			return unescape(document.cookie.substring(start,end))
		}
	}
}
function setCookie(thecookie,value,expire){
	cookieExpires = new Date
	cookieExpires.setMonth(cookieExpires.getMonth() + 6)
	document.cookie = thecookie + "=" + escape(value) + ";expires=" + cookieExpires.toGMTString();
}
function testCookie(thecookie){
	if(getCookie(thecookie)){
		return(getCookie(thecookie));
	}else{
		return false;
	}
}
function CSredPrompt(action) {
	var thecookie = action[5]
	if(testCookie(action[5]) && action[4] == true){	
			location.href=getCookie(action[5]);
	} else {
	var x = 0;
	}
	
	function kill() {
	alert(action[3]);
	x = 1;
	var enter = prompt(action[1],action[2]); 
	if (enter == action[6]){setCookie(action[5], action[7]);location.href=action[7];}
	else if (enter == action[8]){setCookie(action[5], action[9]);location.href=action[9];}
	else if (enter == action[10]){setCookie(action[5], action[11]);location.href=action[11];}
	else if (enter == action[12]){setCookie(action[5], action[13]);location.href=action[13];}
	else if (enter == action[15]){setCookie(action[5], action[16]);location.href=action[16];}
	else if (enter == action[2]){kill();}
	else if (enter == null) return
	else  kill()
	}
	if (x == 0) {
	var enter = prompt(action[1],action[2]); 
	if (enter == action[6]){setCookie(action[5], action[7]);location.href=action[7];}
	else if (enter == action[8]){setCookie(action[5], action[9]);location.href=action[9];}
	else if (enter == action[10]){setCookie(action[5], action[11]);location.href=action[11];}
	else if (enter == action[12]){setCookie(action[5], action[13]);location.href=action[13];}
	else if (enter == action[14]){setCookie(action[5], action[15]);location.href=action[15];}
	else if (enter == action[2]){kill();}
	else if (enter == null) return
	else  kill()
	}
}
// OUT Redirect URL Action 1.1
// Script copyright 1999, OUT Media Design GmbH. All rights reserved.
var OUTredirTimeoutID = 0;
function OUTredirectURL(action) {
	if (action[2]) {
		clearTimeout(OUTredirTimeoutID);
		OUTredirTimeoutID = setTimeout('window.location.href="'+action[1]+'"',action[2])
	} else
		window.location.href = action[1];
	return true;
}
function CSResizeWindow(action) { 
	if(navigator.appVersion.charAt(0) >=4) { window.resizeTo (action[1],action[2]) }
}
function CSScrollDown(action){
	if(navigator.appVersion.charAt(0) >=4) {
		var container = 0	
		if (action[2] > 0)		{
			while (container < action[1]) {
   				window.scrollBy(0,action[2]);
   				container = container + action[2];  
			} 	
      	}
	}
}
function CSScrollLeft(action){
	if(navigator.appVersion.charAt(0) >=4) {
		var container = 0	
		if (action[2] > 0)		{
			while (container < action[1]) {
   				window.scrollBy(-action[2],0);
   				container = container + action[2];  
			} 	
      	}
	}
}
function CSScrollRight(action){
	if(navigator.appVersion.charAt(0) >=4) {
		var container = 0	
		if (action[2] > 0)		{
			while (container < action[1]) {
   				window.scrollBy(action[2],0);
   				container = container + action[2];  
			} 	
      	}
	}
}
function CSScrollUp(action){
	if(navigator.appVersion.charAt(0) >=4) {
		var container = 0	
		if (action[2] > 0)		{
			while (container < action[1]) {
   				window.scrollBy(0,-action[2]);
   				container = container + action[2];  
			} 	
      	}
	}
}
function CSScrollstatus(action) {
phrase = action[1];
speed = action[2];	
(action[3] != true)	? delay = setTimeout("CSScrollleftidle()",20) : delay = setTimeout("CSScrollrightidle()",20)
var thestring
leftphrase = "                                                                                                 " + phrase 
charnum = leftphrase.length;
stringnum = leftphrase.length;	
size = leftphrase.length+1
}
function CSScrollrightidle() {
	stringnum--;
	(stringnum != 0) ? window.status = leftphrase.substring(charnum,stringnum) : stringnum = charnum
	delay = setTimeout("CSScrollrightidle()",speed); 
	}
	
function CSScrollleftidle() {
   thestring = leftphrase.substring(0,1);
   leftphrase += thestring
   leftphrase = leftphrase.substring(1,size);
   window.status = leftphrase.substring(0,size);
   delay = setTimeout("CSScrollleftidle()",speed);
}
var textErrFlag=false // Copyright 2004 Michael Åhgren version: 1.3 
var radioErrFlag=false
var selectErrFlag=false
var matchErrFlag=false
var errMsg=null
var color=""
var radioArray=new Array()
var selectArray=new Array()
var radioCount=0
var selectCount=0
var colorTest=false
var errColor=null
var colorEnabled=false
function CSinitCheck(action){
colorEnabled=action[10]
textErrFlag=false
radioErrFlag=false
selectErrFlag=false
errColor=action[8]
var testForm=eval("document."+action[9])
errFlag=false
action[4]!="" ? errMsg=action[4]+"\n" : errMsg='The following problems have been detected:\n'
for(var i=0; i< testForm.length;i++){
var target=testForm.elements[i]
	if (!document.layers){
	!colorTest ? target.orgcol=target.style.backgroundColor : target.style.backgroundColor= target.orgcol
	}
	if(target.type=="select-one"|| target.type=="select-multiple"){
	CSbuildSelectArray (testForm.elements[i])	
	target.size>1 ? target.unChecked=-1 : target.unChecked=-0
	}
	if(target.type=="radio") CSbuildRadioArray(target)		
	if(target.type=="text"|| target.type=="textarea"){
	target.empty=false
	}
}
colorTest=true
if(action[1]!=""){
	var emptCheck=CSsplitFieldNames(action[1])
	var times1=emptCheck.length
	CSrunCheck(1,emptCheck,times1,testForm,action[10],action[7])
}
if(action[2]!=""){
	var emailCheck=CSsplitFieldNames(action[2])
	var times2=emailCheck.length
	CSrunCheck(2,emailCheck,times2,testForm,action[10],action[5])
}
if(action[3]!=""){
	var phoneCheck=CSsplitFieldNames(action[3])
	var times3=phoneCheck.length
	CSrunCheck(3,phoneCheck,times3,testForm,action[10],action[6])
}
if(action[11]!=""){
	var radioCheck=CSsplitFieldNames(action[11])
	for( i=0;i< radioCheck.length;i++){
	CSradioTest(radioCheck[i],action[10],action[13])
}
}
if (action[12]!=""){
var selectCheck=CSsplitFieldNames(action[12])
for( i=0;i< selectCheck.length;i++){
CSselectTest(selectCheck[i],action[10],action[14])
}
selectCount=0
}
if (action[15]!=""){
CSmatchField(action)
}
if (textErrFlag || radioErrFlag || selectErrFlag || matchErrFlag){
alert(errMsg)
}else{
testForm.submit()
}
}
function CSrunCheck(type,data,times,formName,bColor,msgAction){
	for(var i=0; i< formName.length;i++){
	var target=formName.elements[i]
		if(target.type=="text"|| target.type=="textarea"||target.type=="password"){
			var target=formName.elements[i]
				for(var j=0; j< times; j++){	
					if(type==1){					
						if(target.name	==data[j]&&target.value==""){
						msgAction!="" ? errMsg+=(msgAction+' "'+target.name+'"\n') : errMsg+=('The field "'+target.name+'" is empty.\n');
						target.empty=true
						CSsetColor(target)
						textErrFlag=true
						}
					}
					if(type==2){
						var reE=/^[\w\S?]+@(\w|\w\S?\w|\w[\w+\S+]+\w)\.\w+\b/
						var reTest=reE.test(target.value)
						if (navigator.userAgent.indexOf("Opera")!=-1) reTest=true
						var reE2at=/@/
						reE2at.test(target.value)
						var test2at=RegExp.rightContext
						if(target.name==data[j] && !target.empty&& ( target.value.indexOf("@",1)==-1 || 	target.value.indexOf(".",1)==-1 || !reTest || target.value.indexOf(".")==0 || reE2at.test(test2at))){
						msgAction !="" ? errMsg+=(msgAction+' "'+target.name+'"\n') : errMsg+=('The field "'+target.name+'" contains an incorrect E-mail address.\n');
						CSsetColor(target) 
						target.empty=true
						textErrFlag=true
						}
					}
					if(type==3){
						var reP=/[!"@£¤$%#&=?\\^'*åäöÅÄÖ;:,><§µ½*\|]|[a-z]|[A-Z]/ 
						if(target.name	==data[j] &&  reP.test(target.value)&& !target.empty){
					msgAction!="" ? errMsg+=(msgAction+' "'+target.name+'"\n') :errMsg+=('The field "'+target.name+'" contains illegal charater(s).\n');
						CSsetColor(target)
						textErrFlag=true;				
					}
				}		
			}
		}
	}
}
function CSsplitFieldNames(fieldNames){
afterSplit=fieldNames.split(",")
return afterSplit
}
function CSsetColor(target){
	if (!document.layers && colorEnabled){
	target.style.backgroundColor=errColor
}	
} 
function CSbuildRadioArray(target){
radioArray[radioCount]=target
radioCount++
}
function CSradioTest(groupName,bColor,msgAction){
var testResult=false
for (i=0;i< radioCount;i++){
	if(radioArray[i].name==groupName&&radioArray[i].checked){
		testResult=true
		break
	}
}
	if(!testResult){
		msgAction!="" ? errMsg+=(msgAction+' "'+groupName+'"\n') : errMsg+=('No radio button has been selected for: "'+groupName+'".\n');						
		radioErrFlag=true
			for (i=0;i< radioArray.length;i++){
				if(radioArray[i].name==groupName)
					CSsetColor(radioArray[i])			
		}
	}
radionCount=0
}
function CSbuildSelectArray(target){
selectArray[selectCount]=target
selectCount++
}
function CSselectTest(listName,bColor,msgAction){
for (var i=0;i < selectCount;i++){
	if (selectArray[i].name==listName && selectArray[i].selectedIndex==0 && 		selectArray[i].unChecked==0)  {
		msgAction!="" ? errMsg+=(msgAction+' "'+selectArray[i].name+'"\n') : errMsg+=('No selection has been made from the list: "'+ selectArray[i].name+'"\n')	;				
		CSsetColor(selectArray[i])
		selectErrFlag=true			
		}
	} 
} 
function CSmatchField(action){
newData=CSsplitFieldNames(action[15])
var target1=eval("document."+action[9]+"."+newData[0])
var target2=eval("document."+action[9]+"."+newData[1])
	if(target1.value==target2.value){
		matchErrFlag=false
	}else{
		matchErrFlag=true;
		CSsetColor(target1);
		CSsetColor(target2);
			if (action[16]==""){
				
				errMsg+='Your entry in the field "'+newData[0]+'" doesn\'t match your entry in the field "'+newData[1]+'".'
				}else{
				errMsg+=action[16];
				
				}
		}
	
}
// Copyright 2004 Michael Åhgren
//
//-->
function CSSearchEngine(action) {
var form = action[1]
var elem = action[2]
var theEntry  
if(action[3]==true) { theEntry = action[4] } 
else { theEntry = document.forms[form].elements[elem].value }
var type=action[5];
if(type==0) engine="http://search.adobe.com/cgi-bin/query?mss=simple&pg=q&what=web&fmt=.&where=www_search_main&superq="+theEntry+"&rd=all&q="+theEntry+"&x=39&y=10" /* Adobe.com */
else if(type==1) engine="http://www.altavista.digital.com/cgi-bin/query?pg=q&what=web&fmt=.&q="+theEntry /* Altavista */   
else if(type==2) engine="http://groups.google.com/groups?q="+theEntry+"&hl=en&lr=&safe=off&btnG=Google+Search&site=groups"; /* Google Deja News (Usenet) */  
else if(type==3) engine="http://www.excite.com/search.gw?trace=a&search="+theEntry; /* Excite */
else if(type==4) engine="http://www.search.hotbot.com/hResult.html?SM=MC&MT="+theEntry+"&DV=7&RG=.com&DC=10&DE=2&OPs=MDRTP&_v=2&DU=days&SW=web&search.x=23&search.y=8"; /* HotBot */  
else if(type==5) engine="http://www.google.com/search?q="+theEntry+"&btnG=Google+Search" /* Google */
else if(type==6) engine="http://search.msn.com/results.asp?RS=CHECKED&FORM=MSNH&v=1&q="+theEntry; /* MSN */
else if(type==7) engine="http://www.lycos.com/cgi-bin/pursuit?query="+theEntry+"&matchmode=and&cat=lycos&x=33&y=10"; /* Lycos */
else if(type==8) engine="http://shopper.cnet.com/shopping/search/results/1,10214,0-1257,00.html?tag=st%2Esh%2E1257%2Esbsr&qt="+theEntry+"&cn=&ca=1257" /* Shopper.com */
else if(type==9) engine="http://search.excite.com/search.gw?c=web&lk=webcrawler&onload=&s="+theEntry;/* Webcrawler */
else if(type==10) engine="http://search.yahoo.com/bin/search?p="+theEntry /* Yahoo */
if (theEntry=="") { alert("Please enter a search keyword!") } 
else  { newWindow=window.open(engine, action[6],"toolbar,location,directories,status,menubar,scrollbars,resizable=1") }
}
		
function CSSetBackColor(action) { document.bgColor = action[1]; }
function CSSetImageURL(action) {
	var img=CSGetImage(action[1]);
	if (img) img.src=action[2];
}
// OUT Set Image URL in Frame 1.3.4
// Script copyright 1999-2002 OUT Media Design GmbH. All rights reserved.
function OUTSetImageURLinFrame(action) {
	var img = null;
	var curDoc = null;
	var url = action[2]; if (!url) return;
	if (action[3]=='' || action[3]=="_self" || action[3]=="_blank" || action[3]=="_top" || action[3]=="_parent") { curDoc = document; }
	else { curDoc = OUTFindFrame(action[3],0); curDoc = curDoc ? curDoc.document : document; }
	if (curDoc && curDoc.images) {
		if (url.indexOf("://")<0 && url.charAt(0)!='/') {
			url = location.pathname;
			url = url.substr(0,url.lastIndexOf('/')+1)+action[2];
		}
		if (!IsIE()&&!CSIsW3CDOM) img = OUTFindElement(action[1],curDoc,action[4]);
		else img = curDoc.images[action[1]];
		if (img) img.src = url;
	}
}
function CSSetStatus(action) { self.status = action[1]; }
function ROSetVideoBackgroundColor (act) {
	var delay,color;
	color="#";
	color+=act[1];
	delay=act[2]*1000;
	if(delay>0) {
		var obj=new Object();
		obj.type="color";
		obj.time=delay;
		obj.color=color;
		if(ROOnPLCArray)
			ROOnPLCArray[ROOnPLCArray.length]=obj;
	}
	else
		window.parent.external.SetVideoBackgroundColor(color);
}
function ROShowArtistInfo (act) {
	var show;
	if(act[1]==true)show=1;
	else show=0;
	window.parent.external.HandleAction("ShowArtistInfo("+show+")");
}
function ROShowPreferences (act) {
	var str,type;
	type=act[1];
	str="ShowPreferences(";
	if(type==0)str+="General,General";
	else if(type==1)str+="Connection,Connection";
	else if(type==2)str+="Connection,Playback Settings";
	else if(type==3)str+="Connection,Internet Settings";
	else if(type==4)str+="Connection,Proxy";
	else if(type==5)str+="Connection,Network Transports";
	else if(type==6)str+="My Library,My Library";
	else if(type==7)str+="My Library,Advanced My Library";
	else if(type==8)str+="CD,CD";
	else if(type==9)str+="CD,Advanced CD";
	else if(type==10)str+="Devices,Devices";
	else if(type==11)str+="Accessories,Accessories";
	else if(type==12)str+="Media Types,Media Types";
	else if(type==13)str+="Content,Content";
	else if(type==14)str+="Hardware,Hardware";
	else if(type==15)str+="AutoUpdate,AutoUpdate";
	else return;
	str+=")";
	window.parent.external.HandleAction(str);
}
function CSShowHide(action) {
	if (action[1] == '') return;
	var type=action[2];
	if(type==0) CSSetStyleVis(action[1],0);
	else if(type==1) CSSetStyleVis(action[1],1);
	else if(type==2) { 
		if (CSGetStyleVis(action[1]) == 0) CSSetStyleVis(action[1],1);
		else CSSetStyleVis(action[1],0);
	}
}
function CSSlideNewWindow(action) {
var wh = ""
if (action[7] || action[8] || action[9] == true) wh=action[4]-125
else wh = action[4]
var wf = "";	
wf = wf + "width=" + action[3];
wf = wf + ",height=" + wh;
wf = wf + ",resizable=" + (action[5] ? "yes" : "no");
wf = wf + ",scrollbars=" + (action[6] ? "yes" : "no");
wf = wf + ",menubar=" + (action[7] ? "yes" : "no");
wf = wf + ",toolbar=" + (action[8] ? "yes" : "no");
wf = wf + ",directories=" + (action[9] ? "yes" : "no");
wf = wf + ",location=" + (action[10] ? "yes" : "no");
wf = wf + ",status=" + (action[11] ? "yes" : "no");		
if(navigator.appVersion.charAt(0) >=4) {
var sw=screen.width-20;
var sh=screen.height;
var newwidth=action[3]; 
var newheight=action[4];
var positionleft=(sw-newwidth)/2;
var positiontop=""
if (action[7] || action[8] || action[9] == true) positiontop=(sh-newheight)/3;
else positiontop=(sh-newheight)/2.5;
}
newwindow=window.open(action[1],action[2],wf); 
newwindow.focus()	
if(navigator.appVersion.charAt(0) >=4) {
	for(width1 = 1 ; width1 < positionleft ; width1 = width1 + 10)
	newwindow.moveTo(width1,positiontop)
	}
}
SSnumimg=1; SSsens2=-1;SSsens3=-1
function CSSlideShow(action) 
{
SSmax=action[2]
SSimgNom=action[1]
SSloop=action[4]
SSsens=action[3] 
SSpalin=action[5]
var SSimg = null;
	if (document.images) {
		if (!IsIE()&&CSBVers<5) SSimg = CSFindElement(SSimgNom,0);
		else SSimg = document.images[SSimgNom];
SSstr=SSimg.src
SSn=SSstr.length
SSp=SSn-6
SSpstr=SSstr.substring(0,SSp)
SSnimg=SSstr.substring(SSp,SSp+2)
SSformat=SSstr.substring(SSp+2,SSn)
if (SSformat==".jpg" || SSformat==".JPG" || SSformat==".gif" || SSformat==".GIF")
{}
else
{
 alert("Image extension must be .jpg or .gif (case sensitive). Images must be numbered 01, 02 ...")
}
slide(SSmax,SSformat,SSpstr,SSnimg,SSimgNom,SSloop,SSpalin)
}
}
function slide(SSmax,SSformat,SSpstr,SSnimg,SSimgNom,SSloop,SSpalin)
{
if (SSsens2==true) {SSsens=true}
if (SSsens2==false) {SSsens=false}
if (SSsens==true) 
{
SSsuite=SSnumimg-1
	if (SSnumimg>SSmax)SSsuite=SSmax
	if (SSnumimg<=1 & SSloop==true & SSpalin!=true) { SSsuite=SSmax }
	if (SSnumimg<=1 & SSloop==true & SSpalin==true) { 
		if (SSsens2==-1 & SSsens3==-1) {SSsuite=SSmax;SSsens3=1} else { SSsuite=SSnumimg+1; SSsens2=false }}
	if (SSnumimg<=1 & SSloop!=true & SSpalin!=true) {
		if  (SSsens2==-1 & SSsens3==-1) { SSsuite=SSmax;SSsens3=1 } else {SSsuite=SSnumimg; SSfini()}}
}
else
{
SSmax=SSmax-1
SSsuite=SSnumimg+1
	if (SSnumimg>SSmax & SSloop==true & SSpalin!=true) { SSsuite=1}
	if (SSnumimg>SSmax & SSloop==true & SSpalin==true) {SSsuite=SSnumimg-1; SSsens2=true }
	if (SSnumimg>SSmax & SSloop!=true &  SSpalin!=true) { SSsuite=SSnumimg;SSfini() }
	if (SSnumimg<1) SSsuite=1
}
SSnumimg=SSsuite
if (SSsuite<10) {
	SSaller="0"+SSsuite
	}
	else SSaller=SSsuite
SSsource=SSpstr+SSaller+SSformat
var SSimg = null;
	if (document.images) {
		if (!IsIE()&&CSBVers<5) SSimg = CSFindElement(SSimgNom,0);
		else SSimg = document.images[SSimgNom];
		if (SSimg) SSimg.src = SSsource;
	}
}
function SSfini() {
}
function CSSlideShowAuto(action) 
{
SSAfini=0
SSAnumimg=0
SSAmax=action[2]
SSAimgNom=action[1]
SSAtemps=action[3]*1000
if (action[4]==true) 
		{
		SSAstop=true
		}
	else SSAstop=false
var SSAimg = null;
	if (document.images) {
		if (!IsIE()&&CSBVers<5) SSAimg = CSFindElement(SSAimgNom,0);
		else SSAimg = document.images[SSAimgNom];
str=SSAimg.src
n=str.length
p=n-6
SSApstr=str.substring(0,p)
SSAnimg=str.substring(p,p+2)
SSAformat=str.substring(p+2,n)
if (SSAformat==".jpg" || SSAformat==".JPG" || SSAformat==".gif" || SSAformat==".GIF")
{}
else
{
 alert("Image extension must be .jpg or .gif (case sensitive). Images must use 2 digit naming starting with 01, 02 ... plus extension")
}
if (SSAnimg.substring(0,1)=="0") 
{
SSAnumimg=Number(SSAnimg.substring(1,2))
}
else
{SSAnumimg=Number(SSAnimg)}
SSAtempo(SSAmax,SSAimgNom,SSAtemps,SSAstop,SSApstr,SSAnimg,SSAformat)
}
}
function SSAtempo(SSAmax,SSAimgNom,SSAtemps,SSAstop,SSApstr,SSAnimg,SSAformat)
{
setTimeout("slideAuto(SSAmax,SSAimgNom,SSAstop,SSApstr,SSAnimg,SSAformat)",SSAtemps)
}
function slideAuto(SSAmax,SSAimgNom,SSAstop,SSApstr,SSAnimg,SSAformat)
{
if (SSAfini==1) {
SSAnumimg = SSAnumimg-2
CSSlideShowAutoPause()
}
else 
{
SSAmax=SSAmax-1
SSAsuite=SSAnumimg+1
	if (SSAnumimg>SSAmax)
		{
		SSAsuite=1
		if (SSAstop==true) SSAfini=1
		else
		SSAfini=0
		}
	if (SSAnumimg<1) SSAsuite=1
SSAnumimg=SSAsuite
if (SSAsuite<10) {
	SSAaller="0"+SSAsuite
	}
	else SSAaller=SSAsuite
SSAsource=SSApstr+SSAaller+SSAformat
var SSAimg = null;
	if (document.images) {
		if (!IsIE()&&CSBVers<5) SSAimg = CSFindElement(SSAimgNom,0);
		else SSAimg = document.images[SSAimgNom];
		if (SSAimg) SSAimg.src = SSAsource;
	}
SSAtempo(SSAmax,SSAimgNom,SSAtemps,SSAstop,SSApstr,SSAnimg,SSAformat)
}
}
function CSSlideShowAutoPause() 
{}
function CSSlideShowAutoStop(action) 
{
if (SSAfini==0) SSAfini=1
else SSAfini=0 ; SSAnumimg = SSAnumimg+2 ;  slideAuto(SSAmax,SSAimgNom,SSAstop,SSApstr,SSAnimg,SSAformat)
}
// OUT Start Image Slide Show Action 1.1.4
// Script copyright 1999, 2000 OUT Media Design GmbH. All rights reserved.
function OUTstartImageSlideShow(action) {
	if (document.images!=null) {
		var img = CSGetImage(action[1]);
		if (img.OUTslideShowTimeoutID==0) {
			img.OUTstop = false;
			if (img.OUTsupportsOnLoad) img.onload = OUTtriggerLoadNextImage;
			OUTtriggerLoadNextImage(img.name);
		}
	}
	return true;
}
function CSStopAll(action) { CSStopComplete (); }
// OUT Stop Image Slide Show Action 1.1.4
// Script copyright 1999, 2000 OUT Media Design GmbH. All rights reserved.
function OUTstopImageSlideShow(action) {
	if (document.images!=null) {
		var img = CSGetImage(action[1]);
		if (img.OUTslideShowTimeoutID) {
			clearTimeout(img.OUTslideShowTimeoutID);
			img.OUTslideShowTimeoutID=0;
			img.OUTstop = true;
			if (img.OUTsupportsOnLoad) img.onload = null;
		}
	}
	return true;
}
function CSStopScene(action) { CSStopFunction (action[1]); }
function CSStopSound (action) {if (eval('document.'+action[1])!=null) { eval ('document.' + action[1] + '.stop()');}}
function CSSVGredirect(action){   
	 if(navigator.mimeTypes && navigator.mimeTypes["image/svg-xml"] && navigator.mimeTypes["image/svg-xml"].enabledPlugin ) {
		location.href=action[1]
	}
	 else if (navigator.appName == "Microsoft Internet Explorer") {
       	x = confirm("The page you are trying to view requires the Adobe Scaling Vector Graphics (.SVG) browser plug-in. We could not detect if your browser has this plug-in installed. To attempt to view the page anyway, click OK. Otherwise click CANCEL to view an alternate page")
			if (x == true)  location.href=action[1] 
    }
	else if(action[2] == true) {
		alert(action[3])
	}         
}
		
function CSSWFredirect(action) {    
    if(navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"] && navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
		location.href=action[1]
    }
   else if (navigator.appName == "Microsoft Internet Explorer") {
       	x = confirm("The page you are trying to view requires the Macromedia Flash (.SWF) browser plug-in. We could not detect if your browser has this plug-in installed. To attempt to view the page anyway, click OK. Otherwise click CANCEL to view an alternate page")
			if (x == true)  location.href=action[1] 
	}
	else if(action[2] == true) {
		alert(action[3])
	}         
}
function CSPAKtrg2frames(action) { 
	parent.frames[action[1]].location.href = action[2]
	parent.frames[action[3]].location.href = action[4]
 }
function CSPakRemote(action) { 
	if (TRversion()) {
		if (action[2].length < 1) {
			opener.location.href=action[1];
		}
		else {
			opener.parent.frames[action[2]].location.href=action[1];
		}
	}
	return;
}
function TRversion() {
	return (navigator.appName.indexOf("Netscape") >= 0 && parseInt(navigator.appVersion.charAt(0)) >= 3)
          || (navigator.appName.indexOf("Explorer") >= 0 && parseInt(navigator.appVersion.charAt(0)) >= 3);
}
function CStextswapID(action) {
(action[2] != "") ? (updateobject = action[2]) : (updateobject = action[1]);
(action[5] == true) ? (whichfunction = "disappear()") : (whichfunction = "revert()");
if(document.all) { originaltext = document.all(updateobject).innerHTML };
if(document.getElementById) { originaltext = document.getElementById(updateobject).innerHTML};
timeout = (action[4] != "") ? (action[4] * 1000) : 0;
if(document.getElementById) { originaltext = document.getElementById(updateobject).innerHTML};
timeout = (action[4] != "") ? (action[4] * 1000) : 0;
if (document.all)	 {  document.all(updateobject).innerHTML = action[6] + action[3] + action[7]; if (timeout != 0)  setTimeout(whichfunction,timeout); } 
	else { 	if (document.getElementById) { document.getElementById(updateobject).innerHTML = action[6] + action[3] + action[7];
			if (timeout != 0)   setTimeout(whichfunction,timeout)  }
		}
}
function disappear() {  if (document.all) { document.all(updateobject).innerHTML = "<div id=updateobject></div>" } 
	else { if (document.getElementById) { document.getElementById(updateobject).innerHTML = "" }
	}
}
function revert() { if (document.all) { document.all(updateobject).innerHTML = originaltext } 
	else { if (document.getElementById) { document.getElementById(updateobject).innerHTML = originaltext }
	}
}
function timeRedirect(action) {
var now = new Date();
var hours = now.getHours();
var timeValue = action[1];
if (timeValue >= 12) { timeValue = timeValue - 12; } /* deals with 24-hour time */
if (action[2] == true) { timeValue += 12; } /* deals with PM times */
if (hours < timeValue && action[4] != "(Empty Reference!)" && action[4] != "(EmptyReference!)" && action[3] == true) {
window.location = action[4]; }
if (hours >= timeValue && action[6] != "(Empty Reference!)" && action[6] != "(EmptyReference!)" && action[5] == true) {
window.location = action[6]; }
}
function CSTimeout (condition) {
	var result = false;
	if (typeof (gCurrentIdleObject) == "undefined")	return result;
	if (gCurrentIdleObject.lastTime) {
		var t=new Date();
		if (t.getTime() >= gCurrentIdleObject.lastTime) { 
			if (t.getTime() >= gCurrentIdleObject.nextTime) { 
				gCurrentIdleObject.lastTime = t.getTime() + condition[1]*1000;
				gCurrentIdleObject.nextTime = gCurrentIdleObject.lastTime + condition[1]*1000;
				return false;
			}
			return true;
		}
	} else { 
		var t=new Date();
		gCurrentIdleObject.lastTime = t.getTime() + condition[1]*1000;
		gCurrentIdleObject.nextTime = gCurrentIdleObject.lastTime + condition[1]*1000;
	}
	return result;
}
function CSvisits(action) {
mycookie = action[8]
cookieExpires = new Date
cookieExpires.setMonth(cookieExpires.getMonth() + 12)
visits = eval(cookieVal(mycookie))
visits++
document.cookie = mycookie+"="+visits+";expires=" + cookieExpires.toGMTString()
                
function cookieVal(cookieName) {
	thisCookie = document.cookie.split("; ")
		for (i=0; i<thisCookie.length; i++) {
			if (cookieName == thisCookie[i].split("=")[0]) {
			return thisCookie[i].split("=")[1]
			}
	}
 return 0
}
	if(visits == 1 && action[1] == true) alert(action[2])
	else
	if(action[5] == true) alert(action[3] + " " + visits)
	if(action[6] == true) {
		if(visits == action[7])
		alert(action[4])
		}
}
		
function CSVisitorCookie(action) 
{
resultat = "visitor"
cookiename = action[1]
goUrl = action[2]
var arg = cookiename + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
	   if (document.cookie.substring(i, j) == arg)
     return CSVisitorGetCookie (j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break; 
  }
  VisitorSetCookie(cookiename)
  return null; 
}
function CSVisitorGetCookie (offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1) 
    endstr = document.cookie.length;
  valeur=unescape(document.cookie.substring(offset, endstr))
  if (valeur==resultat)
  VisitorGotoLink(goUrl)
  else
  VisitorSetCookie(cookiename)
}
function VisitorGotoLink(goUrl) {
location = goUrl
}
function VisitorSetCookie(cookiename) 
{
var value="visitor"
var jours=500*24
path="/"
domain=null
var expdate = new Date ();
expdate.setTime (expdate.getTime() + (jours * 60 * 60 * 1000));
SetCookie(cookiename,value,expdate)
}
function SetCookie (cookiename, value) {
  var argv = SetCookie.arguments;
  var argc = SetCookie.arguments.length;
  var expires = (argc > 2) ? argv[2] : null;
  var secure = (argc > 5) ? argv[5] : false;
  document.cookie = cookiename + "=" + escape (value) +
    ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == true) ? "; secure" : "");
}
function CSStartWipe (action)
{
	var el=CSCreateTransElement (action[1], action[2]);
	if (el==null) return;
	var dir=action[3];
	if (dir=="_inLeft") {el.steps=el.clipRect.width/el.maxValue; el.modus="in";}
	else if (dir=="_inRight") {el.steps=el.clipRect.width/el.maxValue; el.modus="in";}
	else if (dir=="_outLeft") {el.steps=el.clipRect.width/el.maxValue; el.modus="out";}
	else if (dir=="_outRight") {el.steps=el.clipRect.width/el.maxValue; el.modus="out";}
	else if (dir=="_inTop") {el.steps=el.clipRect.height/el.maxValue; el.modus="in";}
	else if (dir=="_inBottom") {el.steps=el.clipRect.height/el.maxValue; el.modus="in";}
	else if (dir=="_outTop") {el.steps=el.clipRect.height/el.maxValue; el.modus="out";}
	else if (dir=="_outBottom") {el.steps=el.clipRect.height/el.maxValue; el.modus="out";}
	else if (dir=="_inCenter") {el.HSteps=el.clipRect.width/el.maxValue; el.VSteps=el.clipRect.height/el.maxValue; el.modus="in";}
	else if (dir=="_outCenter") {el.HSteps=el.clipRect.width/el.maxValue; el.VSteps=el.clipRect.height/el.maxValue; el.modus="out";}
	if (el.modus=="") return;
	el.currentValue=0;
	el.glDir=action[3];
	CSStartFunction(CSDoWipe,el);
}
function CSDoWipe (info)
{
	var el = info.data;
	if (el==null) return false;
	if (el.currentValue==el.maxValue) { CSFinishWipe(el); return false; }
	var r = new CSRect(el.clipRect.left,el.clipRect.top,el.clipRect.width,el.clipRect.height);
	var dir=el.glDir;
	if (dir=="_inLeft") {r.left=r.width-el.currentValue*el.steps;}
	else if (dir=="_inTop") {r.top=r.height-el.currentValue*el.steps;}
	else if (dir=="_inRight") {r.width=el.currentValue*el.steps;}
	else if (dir=="_inBottom") {r.height=el.currentValue*el.steps;}
	else if (dir=="_outLeft") {r.width=r.width-el.currentValue*el.steps;}
	else if (dir=="_outTop") {r.height=r.height-el.currentValue*el.steps;}
	else if (dir=="_outRight") {r.left=el.currentValue*el.steps;}
	else if (dir=="_outBottom") {r.top=el.currentValue*el.steps;}
	else if (dir=="_inCenter") {r=CSCenterRectIn(el,r);}
	else if (dir=="_outCenter") {r=CSCenterRectOut(el,r);}
	CSSetLayerClip(el,r);
	el.currentValue+=1;
	return true;
}
function CSFinishWipe (el)
{
	if (el.modus=="in") CSSetLayerClip(el,el.clipRect);
	else { 
		el.clipRect=new CSRect(0,0,el.width,el.height); 
		CSSetLayerClip(el,el.clipRect); 
		CSSetStyleVis(el.layer,0);
	}
	CSDisposeTransElement(el);
}
function CSCenterRectIn(el,r)
{
	var hValue= el.currentValue*el.HSteps/2;
	var vValue= el.currentValue*el.VSteps/2;
	r.left=Math.round(r.left+r.width/2-hValue); 
	r.top=Math.round(r.top+r.height/2-vValue); 
	r.width=Math.round(hValue*2);
	r.height=Math.round(vValue*2);
	return r;
}
function CSCenterRectOut(el,r)
{
	var hValue= el.currentValue*el.HSteps/2;
	var vValue= el.currentValue*el.VSteps/2;
	r.left+=Math.round(hValue); 
	r.top+=Math.round(vValue); 
	r.width-=Math.round(hValue*2);
	r.height-=Math.round(vValue*2);
	return r;
}
function CSshowtime(action) { 
message = action[1]
military = action[2]
offset = action[3] 
dst = action[4]
statuscheck = action[5]
formcheck = action[6]
form = action[7];
elem = action[8];
var dstoffset = 0
theTimer = setTimeout("theClock()",10);
} 
    
function theClock() {   
clearTimeout(theTimer);
var now = new Date();
var correct = now.toGMTString();
time_string = correct.split(' ');
hm = time_string[4];
hm_string = hm.split(':');
var hours = hm_string[0] - 0;
var suffix = " A.M."
if (dst == true) dstoffset = 1
hours = hours + offset + dst;
	if (hours < 0) hours +=24	
	if (hours > 11 && hours < 24)  suffix = " P.M."
	if (hours > 12 && military == false) hours -=12;
	
var minutes = now.getMinutes();
var timeValue12 = "" + ((hours > 12) ? hours -12 : hours)
if (timeValue12 == 0) timeValue12 = 12
var timeValue24 = "" + ((hours > 23) ? hours -24 : hours)
timeValue12 += ((minutes < 10) ? ":0" : ":") + minutes
timeValue12 += suffix
timeValue24 += ((minutes < 10) ? ":0" : ":") + minutes
	if(military == false)  {
	WorldTime = message + timeValue12;
	} else { 
	WorldTime = message + timeValue24
	}  
	if(statuscheck == true)  window.status = WorldTime
	if(formcheck == true)  document.forms[form].elements[elem].value  = WorldTime
theTimer = setTimeout("theClock()",5000);
}
/* EOF */
