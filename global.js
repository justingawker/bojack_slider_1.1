(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/javascript/global.coffee":[function(require,module,exports){
require('./juxtapose.min.js');



},{"./juxtapose.min.js":"/Users/ap/code/labs/interactives/now_and_then/src/javascript/juxtapose.min.js"}],"/Users/ap/code/labs/interactives/now_and_then/src/javascript/juxtapose.min.js":[function(require,module,exports){
/* juxtapose - v1.1.0 - 2015-01-05
 * Copyright (c) 2015 Alex Duner and Northwestern University Knight Lab 
 */
(function(document,window){var juxtapose={sliders:[]};var flickr_key="d90fc2d1f4acc584e08b8eaea5bf4d6c";var FLICKR_SIZE_PREFERENCES=["Large","Medium"];function Graphic(properties,slider){var self=this;this.image=new Image;this.loaded=false;this.image.onload=function(){self.loaded=true;slider._onLoaded()};this.image.src=properties.src;this.label=properties.label||false;this.credit=properties.credit||false}function FlickrGraphic(properties,slider){var self=this;this.image=new Image;this.loaded=false;this.image.onload=function(){self.loaded=true;slider._onLoaded()};this.flickrID=this.getFlickrID(properties.src);this.callFlickrAPI(this.flickrID,self);this.label=properties.label||false;this.credit=properties.credit||false}FlickrGraphic.prototype={getFlickrID:function(url){var idx=url.indexOf("flickr.com/photos/");var pos=idx+"flickr.com/photos/".length;var photo_info=url.substr(pos);if(photo_info.indexOf("/")==-1)return null;if(photo_info.indexOf("/")===0)photo_info=photo_info.substr(1);id=photo_info.split("/")[1];return id},callFlickrAPI:function(id,self){var url="https://api.flickr.com/services/rest/?method=flickr.photos.getSizes"+"&api_key="+flickr_key+"&photo_id="+id+"&format=json&nojsoncallback=1";var request=new XMLHttpRequest;request.open("GET",url,true);request.onload=function(){if(request.status>=200&&request.status<400){data=JSON.parse(request.responseText);var flickr_url=self.bestFlickrUrl(data.sizes.size);self.setFlickrImage(flickr_url)}else{console.error("There was an error getting the picture from Flickr")}};request.onerror=function(){console.error("There was an error getting the picture from Flickr")};request.send()},setFlickrImage:function(src){this.image.src=src},bestFlickrUrl:function(ary){var dict={};for(var i=0;i<ary.length;i++){dict[ary[i].label]=ary[i].source}for(var j=0;j<FLICKR_SIZE_PREFERENCES.length;j++){if(FLICKR_SIZE_PREFERENCES[j]in dict){return dict[FLICKR_SIZE_PREFERENCES[j]]}}return ary[0].source}};function getNaturalDimensions(DOMelement){if(DOMelement.naturalWidth&&DOMelement.naturalHeight){return{width:DOMelement.naturalWidth,height:DOMelement.naturalHeight}}var img=new Image;img.src=DOMelement.src;return{width:img.width,height:img.height}}function getImageDimensions(img){var dimensions={width:getNaturalDimensions(img).width,height:getNaturalDimensions(img).height,aspect:function(){return this.width/this.height}};return dimensions}function addClass(element,c){if(element.classList){element.classList.add(c)}else{element.className+=" "+c}}function removeClass(element,c){element.className=element.className.replace(/(\S+)\s*/g,function(w,match){if(match===c){return""}return w}).replace(/^\s+/,"")}function setText(element,text){if(document.body.textContent){element.textContent=text}else{element.innerText=text}}function getComputedWidthAndHeight(element){if(window.getComputedStyle){return{width:parseInt(getComputedStyle(element).width,10),height:parseInt(getComputedStyle(element).height,10)}}else{w=element.getBoundingClientRect().right-element.getBoundingClientRect().left;h=element.getBoundingClientRect().bottom-element.getBoundingClientRect().top;return{width:parseInt(w,10)||0,height:parseInt(h,10)||0}}}function getPageX(e){var pageX;if(e.pageX){pageX=e.pageX}else if(e.touches){pageX=e.touches[0].pageX}else{pageX=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft}return pageX}function getPageY(e){var pageY;if(e.pageY){pageY=e.pageY}else if(e.touches){pageT=e.touches[0].pageY}else{pageY=e.clientY+document.body.scrollTop+document.documentElement.scrollTop}return pageY}function checkFlickr(url){var idx=url.indexOf("flickr.com/photos/");if(idx==-1){return false}else{return true}}function getLeftPercent(slider,input){if(typeof input==="string"||typeof input==="number"){leftPercent=parseInt(input,10)}else{var sliderRect=slider.getBoundingClientRect();var offset={top:sliderRect.top+document.body.scrollTop,left:sliderRect.left+document.body.scrollLeft};var width=slider.offsetWidth;var pageX=getPageX(input);var relativeX=pageX-offset.left;leftPercent=relativeX/width*100}return leftPercent}function getTopPercent(slider,input){if(typeof input==="string"||typeof input==="number"){topPercent=parseInt(input,10)}else{var sliderRect=slider.getBoundingClientRect();var offset={top:sliderRect.top+document.body.scrollTop,left:sliderRect.left+document.body.scrollLeft};var width=slider.offsetHeight;var pageY=getPageY(input);var relativeY=pageY-offset.top;topPercent=relativeY/width*100}return topPercent}var BOOLEAN_OPTIONS={animate:true,showLabels:true,showCredits:true};function interpret_boolean(x){if(typeof x!="string"){return Boolean(x)}return!(x==="false"||x==="")}function JXSlider(selector,images,options){this.selector=selector;var i;this.options={animate:true,showLabels:true,showCredits:true,startingPosition:"50%",mode:"horizontal"};for(i in this.options){if(i in options){if(i in BOOLEAN_OPTIONS){this.options[i]=interpret_boolean(options[i])}else{this.options[i]=options[i]}}}if(images.length==2){if(checkFlickr(images[0].src)){this.imgBefore=new FlickrGraphic(images[0],this)}else{this.imgBefore=new Graphic(images[0],this)}if(checkFlickr(images[1].src)){this.imgAfter=new FlickrGraphic(images[1],this)}else{this.imgAfter=new Graphic(images[1],this)}}else{console.warn("The images parameter takes two Image objects.")}if(this.imgBefore.credit||this.imgAfter.credit){this.options.showCredits=true}else{this.options.showCredits=false}}JXSlider.prototype={updateSlider:function(input,animate){var leftPercent,rightPercent;if(this.options.mode==="vertical"){leftPercent=getTopPercent(this.slider,input)}else{leftPercent=getLeftPercent(this.slider,input)}leftPercent=Math.round(leftPercent)+"%";leftPercentNum=parseInt(leftPercent);rightPercent=Math.round(100-leftPercentNum)+"%";if(leftPercentNum>0&&leftPercentNum<100){removeClass(this.handle,"transition");removeClass(this.rightImage,"transition");removeClass(this.leftImage,"transition");if(this.options.animate&&animate){addClass(this.handle,"transition");addClass(this.leftImage,"transition");addClass(this.rightImage,"transition")}if(this.options.mode==="vertical"){this.handle.style.top=leftPercent;this.leftImage.style.height=leftPercent;this.rightImage.style.height=rightPercent}else{this.handle.style.left=leftPercent;this.leftImage.style.width=leftPercent;this.rightImage.style.width=rightPercent}this.sliderPosition=leftPercent}},getPosition:function(){return this.sliderPosition},displayLabel:function(element,labelText){label=document.createElement("div");label.className="jx-label";label.setAttribute("tabindex",0);setText(label,labelText);element.appendChild(label)},displayCredits:function(){credit=document.createElement("div");credit.className="jx-credit";text="<em>Photo Credits:</em>";if(this.imgBefore.credit){text+=" <em>Before</em> "+this.imgBefore.credit}if(this.imgAfter.credit){text+=" <em>After</em> "+this.imgAfter.credit}credit.innerHTML=text;this.wrapper.appendChild(credit)},setStartingPosition:function(s){this.options.startingPosition=s},checkImages:function(){if(getImageDimensions(this.imgBefore.image).aspect()==getImageDimensions(this.imgAfter.image).aspect()){return true}else{return false}},setWrapperDimensions:function(){ratio=getImageDimensions(this.imgBefore.image).aspect();width=getComputedWidthAndHeight(this.wrapper).width;height=getComputedWidthAndHeight(this.wrapper).height;if(width){height=width/ratio;this.wrapper.style.height=parseInt(height)+"px"}else if(height){width=height*ratio;this.wrapper.style.width=parseInt(width)+"px"}},_onLoaded:function(){if(this.imgBefore&&this.imgBefore.loaded===true&&this.imgAfter&&this.imgAfter.loaded===true){this.wrapper=document.querySelector(this.selector);addClass(this.wrapper,"juxtapose");this.wrapper.style.width=getNaturalDimensions(this.imgBefore.image).width;this.setWrapperDimensions();this.slider=document.createElement("div");this.slider.className="jx-slider";this.wrapper.appendChild(this.slider);if(this.options.mode!="horizontal"){addClass(this.slider,this.options.mode)}this.handle=document.createElement("div");this.handle.className="jx-handle";this.rightImage=document.createElement("div");this.rightImage.className="jx-image jx-right";this.rightImage.appendChild(this.imgAfter.image);this.leftImage=document.createElement("div");this.leftImage.className="jx-image jx-left";this.leftImage.appendChild(this.imgBefore.image);this.labCredit=document.createElement("a");this.labCredit.setAttribute("href","http://juxtapose.knightlab.com");this.labCredit.className="jx-knightlab";this.labLogo=document.createElement("div");this.labLogo.className="knightlab-logo";this.labCredit.appendChild(this.labLogo);this.projectName=document.createElement("span");this.projectName.className="juxtapose-name";setText(this.projectName,"JuxtaposeJS");this.labCredit.appendChild(this.projectName);this.slider.appendChild(this.handle);this.slider.appendChild(this.leftImage);this.slider.appendChild(this.rightImage);this.slider.appendChild(this.labCredit);this.leftArrow=document.createElement("div");this.rightArrow=document.createElement("div");this.control=document.createElement("div");this.controller=document.createElement("div");this.leftArrow.className="jx-arrow jx-left";this.rightArrow.className="jx-arrow jx-right";this.control.className="jx-control";this.controller.className="jx-controller";this.controller.setAttribute("tabindex",0);this.controller.setAttribute("role","slider");this.controller.setAttribute("aria-valuenow",50);this.controller.setAttribute("aria-valuemin",0);this.controller.setAttribute("aria-valuemax",100);this.handle.appendChild(this.leftArrow);this.handle.appendChild(this.control);this.handle.appendChild(this.rightArrow);this.control.appendChild(this.controller);this._init()}},_init:function(){if(this.checkImages()===false){console.warn(this,"Check that the two images have the same aspect ratio for the slider to work correctly.")}this.updateSlider(this.options.startingPosition,false);if(this.options.showLabels===true){if(this.imgBefore.label){this.displayLabel(this.leftImage,this.imgBefore.label)}if(this.imgAfter.label){this.displayLabel(this.rightImage,this.imgAfter.label)}}if(this.options.showCredits===true){this.displayCredits()}var self=this;window.addEventListener("resize",function(){self.setWrapperDimensions()});this.slider.addEventListener("mousedown",function(e){e=e||window.event;e.preventDefault();self.updateSlider(e,true);animate=true;this.addEventListener("mousemove",function(e){e=e||window.event;e.preventDefault();if(animate){self.updateSlider(e,false)}});document.addEventListener("mouseup",function(e){e=e||window.event;e.preventDefault();animate=false})});this.slider.addEventListener("touchstart",function(e){e=e||window.event;e.preventDefault();self.updateSlider(e,true);this.addEventListener("touchmove",function(e){e=e||window.event;e.preventDefault();self.updateSlider(event,false)})});this.handle.addEventListener("keydown",function(e){e=e||window.event;var key=event.which||event.keyCode;var ariaValue=parseFloat(this.style.left);if(key==37){ariaValue=ariaValue-1;var leftStart=parseFloat(this.style.left)-1;self.updateSlider(leftStart,false);self.controller.setAttribute("aria-valuenow",ariaValue)}if(key==39){ariaValue=ariaValue+1;var rightStart=parseFloat(this.style.left)+1;self.updateSlider(rightStart,false);self.controller.setAttribute("aria-valuenow",ariaValue)}});this.leftImage.addEventListener("keydown",function(event){var key=event.which||event.keyCode;if(key==13||key==32){self.updateSlider("90%",true);self.controller.setAttribute("aria-valuenow",90)}});this.rightImage.addEventListener("keydown",function(event){var key=event.which||event.keyCode;if(key==13||key==32){self.updateSlider("10%",true);self.controller.setAttribute("aria-valuenow",10)}})}};juxtapose.makeSlider=function(element,idx){if(typeof idx=="undefined"){idx=juxtapose.sliders.length}var w=element;var images=w.querySelectorAll("img");var options={};if(w.getAttribute("data-animate")){options.animate=w.getAttribute("data-animate")}if(w.getAttribute("data-showlabels")){options.showLabels=w.getAttribute("data-showlabels")}if(w.getAttribute("data-showcredits")){options.showCredits=w.getAttribute("data-showcredits")}if(w.getAttribute("data-startingposition")){options.startingPosition=w.getAttribute("data-startingposition")}if(w.getAttribute("data-mode")){options.mode=w.getAttribute("data-mode")}specificClass="juxtapose-"+idx;addClass(element,specificClass);selector="."+specificClass;if(w.innerHTML){w.innerHTML=""}else{w.innerText=""}slider=new juxtapose.JXSlider(selector,[{src:images[0].src,label:images[0].getAttribute("data-label"),credit:images[0].getAttribute("data-credit")},{src:images[1].src,label:images[1].getAttribute("data-label"),credit:images[1].getAttribute("data-credit")}],options);juxtapose.sliders.push(slider)};juxtapose.scanPage=function(){var elements=document.querySelectorAll(".juxtapose");for(var i=0;i<elements.length;i++){juxtapose.makeSlider(elements[i],i)}};juxtapose.JXSlider=JXSlider;window.juxtapose=juxtapose;juxtapose.scanPage()})(document,window);(function(win,doc){if(win.addEventListener)return;function docHijack(p){var old=doc[p];doc[p]=function(v){return addListen(old(v))}}function addEvent(on,fn,self){return(self=this).attachEvent("on"+on,function(e){var e=e||win.event;e.preventDefault=e.preventDefault||function(){e.returnValue=false};e.stopPropagation=e.stopPropagation||function(){e.cancelBubble=true};fn.call(self,e)})}function addListen(obj,i){if(i=obj.length)while(i--)obj[i].addEventListener=addEvent;else obj.addEventListener=addEvent;return obj}addListen([doc,win]);if("Element"in win)win.Element.prototype.addEventListener=addEvent;else{doc.attachEvent("onreadystatechange",function(){addListen(doc.all)});docHijack("getElementsByTagName");docHijack("getElementById");docHijack("createElement");addListen(doc.all)}})(window,document);
},{}]},{},["./src/javascript/global.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXAvY29kZS9sYWJzL2ludGVyYWN0aXZlcy9ub3dfYW5kX3RoZW4vc3JjL2phdmFzY3JpcHQvZ2xvYmFsLmNvZmZlZSIsInNyYy9qYXZhc2NyaXB0L2p1eHRhcG9zZS5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxPQUFBLENBQVEsb0JBQVIsQ0FBQSxDQUFBOzs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgQnJvd3NlcmlmeSBlbnRyeSBwb2ludCBmb3IgdGhlIGdsb2JhbC5qcyBidW5kbGUgKHlheSBDb2ZmZWVTY3JpcHQhKVxuXG5yZXF1aXJlICcuL2p1eHRhcG9zZS5taW4uanMnXG4iLCIvKiBqdXh0YXBvc2UgLSB2MS4xLjAgLSAyMDE1LTAxLTA1XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgQWxleCBEdW5lciBhbmQgTm9ydGh3ZXN0ZXJuIFVuaXZlcnNpdHkgS25pZ2h0IExhYiBcbiAqL1xuKGZ1bmN0aW9uKGRvY3VtZW50LHdpbmRvdyl7dmFyIGp1eHRhcG9zZT17c2xpZGVyczpbXX07dmFyIGZsaWNrcl9rZXk9XCJkOTBmYzJkMWY0YWNjNTg0ZTA4YjhlYWVhNWJmNGQ2Y1wiO3ZhciBGTElDS1JfU0laRV9QUkVGRVJFTkNFUz1bXCJMYXJnZVwiLFwiTWVkaXVtXCJdO2Z1bmN0aW9uIEdyYXBoaWMocHJvcGVydGllcyxzbGlkZXIpe3ZhciBzZWxmPXRoaXM7dGhpcy5pbWFnZT1uZXcgSW1hZ2U7dGhpcy5sb2FkZWQ9ZmFsc2U7dGhpcy5pbWFnZS5vbmxvYWQ9ZnVuY3Rpb24oKXtzZWxmLmxvYWRlZD10cnVlO3NsaWRlci5fb25Mb2FkZWQoKX07dGhpcy5pbWFnZS5zcmM9cHJvcGVydGllcy5zcmM7dGhpcy5sYWJlbD1wcm9wZXJ0aWVzLmxhYmVsfHxmYWxzZTt0aGlzLmNyZWRpdD1wcm9wZXJ0aWVzLmNyZWRpdHx8ZmFsc2V9ZnVuY3Rpb24gRmxpY2tyR3JhcGhpYyhwcm9wZXJ0aWVzLHNsaWRlcil7dmFyIHNlbGY9dGhpczt0aGlzLmltYWdlPW5ldyBJbWFnZTt0aGlzLmxvYWRlZD1mYWxzZTt0aGlzLmltYWdlLm9ubG9hZD1mdW5jdGlvbigpe3NlbGYubG9hZGVkPXRydWU7c2xpZGVyLl9vbkxvYWRlZCgpfTt0aGlzLmZsaWNrcklEPXRoaXMuZ2V0RmxpY2tySUQocHJvcGVydGllcy5zcmMpO3RoaXMuY2FsbEZsaWNrckFQSSh0aGlzLmZsaWNrcklELHNlbGYpO3RoaXMubGFiZWw9cHJvcGVydGllcy5sYWJlbHx8ZmFsc2U7dGhpcy5jcmVkaXQ9cHJvcGVydGllcy5jcmVkaXR8fGZhbHNlfUZsaWNrckdyYXBoaWMucHJvdG90eXBlPXtnZXRGbGlja3JJRDpmdW5jdGlvbih1cmwpe3ZhciBpZHg9dXJsLmluZGV4T2YoXCJmbGlja3IuY29tL3Bob3Rvcy9cIik7dmFyIHBvcz1pZHgrXCJmbGlja3IuY29tL3Bob3Rvcy9cIi5sZW5ndGg7dmFyIHBob3RvX2luZm89dXJsLnN1YnN0cihwb3MpO2lmKHBob3RvX2luZm8uaW5kZXhPZihcIi9cIik9PS0xKXJldHVybiBudWxsO2lmKHBob3RvX2luZm8uaW5kZXhPZihcIi9cIik9PT0wKXBob3RvX2luZm89cGhvdG9faW5mby5zdWJzdHIoMSk7aWQ9cGhvdG9faW5mby5zcGxpdChcIi9cIilbMV07cmV0dXJuIGlkfSxjYWxsRmxpY2tyQVBJOmZ1bmN0aW9uKGlkLHNlbGYpe3ZhciB1cmw9XCJodHRwczovL2FwaS5mbGlja3IuY29tL3NlcnZpY2VzL3Jlc3QvP21ldGhvZD1mbGlja3IucGhvdG9zLmdldFNpemVzXCIrXCImYXBpX2tleT1cIitmbGlja3Jfa2V5K1wiJnBob3RvX2lkPVwiK2lkK1wiJmZvcm1hdD1qc29uJm5vanNvbmNhbGxiYWNrPTFcIjt2YXIgcmVxdWVzdD1uZXcgWE1MSHR0cFJlcXVlc3Q7cmVxdWVzdC5vcGVuKFwiR0VUXCIsdXJsLHRydWUpO3JlcXVlc3Qub25sb2FkPWZ1bmN0aW9uKCl7aWYocmVxdWVzdC5zdGF0dXM+PTIwMCYmcmVxdWVzdC5zdGF0dXM8NDAwKXtkYXRhPUpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO3ZhciBmbGlja3JfdXJsPXNlbGYuYmVzdEZsaWNrclVybChkYXRhLnNpemVzLnNpemUpO3NlbGYuc2V0RmxpY2tySW1hZ2UoZmxpY2tyX3VybCl9ZWxzZXtjb25zb2xlLmVycm9yKFwiVGhlcmUgd2FzIGFuIGVycm9yIGdldHRpbmcgdGhlIHBpY3R1cmUgZnJvbSBGbGlja3JcIil9fTtyZXF1ZXN0Lm9uZXJyb3I9ZnVuY3Rpb24oKXtjb25zb2xlLmVycm9yKFwiVGhlcmUgd2FzIGFuIGVycm9yIGdldHRpbmcgdGhlIHBpY3R1cmUgZnJvbSBGbGlja3JcIil9O3JlcXVlc3Quc2VuZCgpfSxzZXRGbGlja3JJbWFnZTpmdW5jdGlvbihzcmMpe3RoaXMuaW1hZ2Uuc3JjPXNyY30sYmVzdEZsaWNrclVybDpmdW5jdGlvbihhcnkpe3ZhciBkaWN0PXt9O2Zvcih2YXIgaT0wO2k8YXJ5Lmxlbmd0aDtpKyspe2RpY3RbYXJ5W2ldLmxhYmVsXT1hcnlbaV0uc291cmNlfWZvcih2YXIgaj0wO2o8RkxJQ0tSX1NJWkVfUFJFRkVSRU5DRVMubGVuZ3RoO2orKyl7aWYoRkxJQ0tSX1NJWkVfUFJFRkVSRU5DRVNbal1pbiBkaWN0KXtyZXR1cm4gZGljdFtGTElDS1JfU0laRV9QUkVGRVJFTkNFU1tqXV19fXJldHVybiBhcnlbMF0uc291cmNlfX07ZnVuY3Rpb24gZ2V0TmF0dXJhbERpbWVuc2lvbnMoRE9NZWxlbWVudCl7aWYoRE9NZWxlbWVudC5uYXR1cmFsV2lkdGgmJkRPTWVsZW1lbnQubmF0dXJhbEhlaWdodCl7cmV0dXJue3dpZHRoOkRPTWVsZW1lbnQubmF0dXJhbFdpZHRoLGhlaWdodDpET01lbGVtZW50Lm5hdHVyYWxIZWlnaHR9fXZhciBpbWc9bmV3IEltYWdlO2ltZy5zcmM9RE9NZWxlbWVudC5zcmM7cmV0dXJue3dpZHRoOmltZy53aWR0aCxoZWlnaHQ6aW1nLmhlaWdodH19ZnVuY3Rpb24gZ2V0SW1hZ2VEaW1lbnNpb25zKGltZyl7dmFyIGRpbWVuc2lvbnM9e3dpZHRoOmdldE5hdHVyYWxEaW1lbnNpb25zKGltZykud2lkdGgsaGVpZ2h0OmdldE5hdHVyYWxEaW1lbnNpb25zKGltZykuaGVpZ2h0LGFzcGVjdDpmdW5jdGlvbigpe3JldHVybiB0aGlzLndpZHRoL3RoaXMuaGVpZ2h0fX07cmV0dXJuIGRpbWVuc2lvbnN9ZnVuY3Rpb24gYWRkQ2xhc3MoZWxlbWVudCxjKXtpZihlbGVtZW50LmNsYXNzTGlzdCl7ZWxlbWVudC5jbGFzc0xpc3QuYWRkKGMpfWVsc2V7ZWxlbWVudC5jbGFzc05hbWUrPVwiIFwiK2N9fWZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW1lbnQsYyl7ZWxlbWVudC5jbGFzc05hbWU9ZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZSgvKFxcUyspXFxzKi9nLGZ1bmN0aW9uKHcsbWF0Y2gpe2lmKG1hdGNoPT09Yyl7cmV0dXJuXCJcIn1yZXR1cm4gd30pLnJlcGxhY2UoL15cXHMrLyxcIlwiKX1mdW5jdGlvbiBzZXRUZXh0KGVsZW1lbnQsdGV4dCl7aWYoZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudCl7ZWxlbWVudC50ZXh0Q29udGVudD10ZXh0fWVsc2V7ZWxlbWVudC5pbm5lclRleHQ9dGV4dH19ZnVuY3Rpb24gZ2V0Q29tcHV0ZWRXaWR0aEFuZEhlaWdodChlbGVtZW50KXtpZih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSl7cmV0dXJue3dpZHRoOnBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkud2lkdGgsMTApLGhlaWdodDpwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmhlaWdodCwxMCl9fWVsc2V7dz1lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0LWVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtoPWVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tLWVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO3JldHVybnt3aWR0aDpwYXJzZUludCh3LDEwKXx8MCxoZWlnaHQ6cGFyc2VJbnQoaCwxMCl8fDB9fX1mdW5jdGlvbiBnZXRQYWdlWChlKXt2YXIgcGFnZVg7aWYoZS5wYWdlWCl7cGFnZVg9ZS5wYWdlWH1lbHNlIGlmKGUudG91Y2hlcyl7cGFnZVg9ZS50b3VjaGVzWzBdLnBhZ2VYfWVsc2V7cGFnZVg9ZS5jbGllbnRYK2RvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdH1yZXR1cm4gcGFnZVh9ZnVuY3Rpb24gZ2V0UGFnZVkoZSl7dmFyIHBhZ2VZO2lmKGUucGFnZVkpe3BhZ2VZPWUucGFnZVl9ZWxzZSBpZihlLnRvdWNoZXMpe3BhZ2VUPWUudG91Y2hlc1swXS5wYWdlWX1lbHNle3BhZ2VZPWUuY2xpZW50WStkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wfXJldHVybiBwYWdlWX1mdW5jdGlvbiBjaGVja0ZsaWNrcih1cmwpe3ZhciBpZHg9dXJsLmluZGV4T2YoXCJmbGlja3IuY29tL3Bob3Rvcy9cIik7aWYoaWR4PT0tMSl7cmV0dXJuIGZhbHNlfWVsc2V7cmV0dXJuIHRydWV9fWZ1bmN0aW9uIGdldExlZnRQZXJjZW50KHNsaWRlcixpbnB1dCl7aWYodHlwZW9mIGlucHV0PT09XCJzdHJpbmdcInx8dHlwZW9mIGlucHV0PT09XCJudW1iZXJcIil7bGVmdFBlcmNlbnQ9cGFyc2VJbnQoaW5wdXQsMTApfWVsc2V7dmFyIHNsaWRlclJlY3Q9c2xpZGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3ZhciBvZmZzZXQ9e3RvcDpzbGlkZXJSZWN0LnRvcCtkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCxsZWZ0OnNsaWRlclJlY3QubGVmdCtkb2N1bWVudC5ib2R5LnNjcm9sbExlZnR9O3ZhciB3aWR0aD1zbGlkZXIub2Zmc2V0V2lkdGg7dmFyIHBhZ2VYPWdldFBhZ2VYKGlucHV0KTt2YXIgcmVsYXRpdmVYPXBhZ2VYLW9mZnNldC5sZWZ0O2xlZnRQZXJjZW50PXJlbGF0aXZlWC93aWR0aCoxMDB9cmV0dXJuIGxlZnRQZXJjZW50fWZ1bmN0aW9uIGdldFRvcFBlcmNlbnQoc2xpZGVyLGlucHV0KXtpZih0eXBlb2YgaW5wdXQ9PT1cInN0cmluZ1wifHx0eXBlb2YgaW5wdXQ9PT1cIm51bWJlclwiKXt0b3BQZXJjZW50PXBhcnNlSW50KGlucHV0LDEwKX1lbHNle3ZhciBzbGlkZXJSZWN0PXNsaWRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTt2YXIgb2Zmc2V0PXt0b3A6c2xpZGVyUmVjdC50b3ArZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AsbGVmdDpzbGlkZXJSZWN0LmxlZnQrZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0fTt2YXIgd2lkdGg9c2xpZGVyLm9mZnNldEhlaWdodDt2YXIgcGFnZVk9Z2V0UGFnZVkoaW5wdXQpO3ZhciByZWxhdGl2ZVk9cGFnZVktb2Zmc2V0LnRvcDt0b3BQZXJjZW50PXJlbGF0aXZlWS93aWR0aCoxMDB9cmV0dXJuIHRvcFBlcmNlbnR9dmFyIEJPT0xFQU5fT1BUSU9OUz17YW5pbWF0ZTp0cnVlLHNob3dMYWJlbHM6dHJ1ZSxzaG93Q3JlZGl0czp0cnVlfTtmdW5jdGlvbiBpbnRlcnByZXRfYm9vbGVhbih4KXtpZih0eXBlb2YgeCE9XCJzdHJpbmdcIil7cmV0dXJuIEJvb2xlYW4oeCl9cmV0dXJuISh4PT09XCJmYWxzZVwifHx4PT09XCJcIil9ZnVuY3Rpb24gSlhTbGlkZXIoc2VsZWN0b3IsaW1hZ2VzLG9wdGlvbnMpe3RoaXMuc2VsZWN0b3I9c2VsZWN0b3I7dmFyIGk7dGhpcy5vcHRpb25zPXthbmltYXRlOnRydWUsc2hvd0xhYmVsczp0cnVlLHNob3dDcmVkaXRzOnRydWUsc3RhcnRpbmdQb3NpdGlvbjpcIjUwJVwiLG1vZGU6XCJob3Jpem9udGFsXCJ9O2ZvcihpIGluIHRoaXMub3B0aW9ucyl7aWYoaSBpbiBvcHRpb25zKXtpZihpIGluIEJPT0xFQU5fT1BUSU9OUyl7dGhpcy5vcHRpb25zW2ldPWludGVycHJldF9ib29sZWFuKG9wdGlvbnNbaV0pfWVsc2V7dGhpcy5vcHRpb25zW2ldPW9wdGlvbnNbaV19fX1pZihpbWFnZXMubGVuZ3RoPT0yKXtpZihjaGVja0ZsaWNrcihpbWFnZXNbMF0uc3JjKSl7dGhpcy5pbWdCZWZvcmU9bmV3IEZsaWNrckdyYXBoaWMoaW1hZ2VzWzBdLHRoaXMpfWVsc2V7dGhpcy5pbWdCZWZvcmU9bmV3IEdyYXBoaWMoaW1hZ2VzWzBdLHRoaXMpfWlmKGNoZWNrRmxpY2tyKGltYWdlc1sxXS5zcmMpKXt0aGlzLmltZ0FmdGVyPW5ldyBGbGlja3JHcmFwaGljKGltYWdlc1sxXSx0aGlzKX1lbHNle3RoaXMuaW1nQWZ0ZXI9bmV3IEdyYXBoaWMoaW1hZ2VzWzFdLHRoaXMpfX1lbHNle2NvbnNvbGUud2FybihcIlRoZSBpbWFnZXMgcGFyYW1ldGVyIHRha2VzIHR3byBJbWFnZSBvYmplY3RzLlwiKX1pZih0aGlzLmltZ0JlZm9yZS5jcmVkaXR8fHRoaXMuaW1nQWZ0ZXIuY3JlZGl0KXt0aGlzLm9wdGlvbnMuc2hvd0NyZWRpdHM9dHJ1ZX1lbHNle3RoaXMub3B0aW9ucy5zaG93Q3JlZGl0cz1mYWxzZX19SlhTbGlkZXIucHJvdG90eXBlPXt1cGRhdGVTbGlkZXI6ZnVuY3Rpb24oaW5wdXQsYW5pbWF0ZSl7dmFyIGxlZnRQZXJjZW50LHJpZ2h0UGVyY2VudDtpZih0aGlzLm9wdGlvbnMubW9kZT09PVwidmVydGljYWxcIil7bGVmdFBlcmNlbnQ9Z2V0VG9wUGVyY2VudCh0aGlzLnNsaWRlcixpbnB1dCl9ZWxzZXtsZWZ0UGVyY2VudD1nZXRMZWZ0UGVyY2VudCh0aGlzLnNsaWRlcixpbnB1dCl9bGVmdFBlcmNlbnQ9TWF0aC5yb3VuZChsZWZ0UGVyY2VudCkrXCIlXCI7bGVmdFBlcmNlbnROdW09cGFyc2VJbnQobGVmdFBlcmNlbnQpO3JpZ2h0UGVyY2VudD1NYXRoLnJvdW5kKDEwMC1sZWZ0UGVyY2VudE51bSkrXCIlXCI7aWYobGVmdFBlcmNlbnROdW0+MCYmbGVmdFBlcmNlbnROdW08MTAwKXtyZW1vdmVDbGFzcyh0aGlzLmhhbmRsZSxcInRyYW5zaXRpb25cIik7cmVtb3ZlQ2xhc3ModGhpcy5yaWdodEltYWdlLFwidHJhbnNpdGlvblwiKTtyZW1vdmVDbGFzcyh0aGlzLmxlZnRJbWFnZSxcInRyYW5zaXRpb25cIik7aWYodGhpcy5vcHRpb25zLmFuaW1hdGUmJmFuaW1hdGUpe2FkZENsYXNzKHRoaXMuaGFuZGxlLFwidHJhbnNpdGlvblwiKTthZGRDbGFzcyh0aGlzLmxlZnRJbWFnZSxcInRyYW5zaXRpb25cIik7YWRkQ2xhc3ModGhpcy5yaWdodEltYWdlLFwidHJhbnNpdGlvblwiKX1pZih0aGlzLm9wdGlvbnMubW9kZT09PVwidmVydGljYWxcIil7dGhpcy5oYW5kbGUuc3R5bGUudG9wPWxlZnRQZXJjZW50O3RoaXMubGVmdEltYWdlLnN0eWxlLmhlaWdodD1sZWZ0UGVyY2VudDt0aGlzLnJpZ2h0SW1hZ2Uuc3R5bGUuaGVpZ2h0PXJpZ2h0UGVyY2VudH1lbHNle3RoaXMuaGFuZGxlLnN0eWxlLmxlZnQ9bGVmdFBlcmNlbnQ7dGhpcy5sZWZ0SW1hZ2Uuc3R5bGUud2lkdGg9bGVmdFBlcmNlbnQ7dGhpcy5yaWdodEltYWdlLnN0eWxlLndpZHRoPXJpZ2h0UGVyY2VudH10aGlzLnNsaWRlclBvc2l0aW9uPWxlZnRQZXJjZW50fX0sZ2V0UG9zaXRpb246ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zbGlkZXJQb3NpdGlvbn0sZGlzcGxheUxhYmVsOmZ1bmN0aW9uKGVsZW1lbnQsbGFiZWxUZXh0KXtsYWJlbD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2xhYmVsLmNsYXNzTmFtZT1cImp4LWxhYmVsXCI7bGFiZWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwwKTtzZXRUZXh0KGxhYmVsLGxhYmVsVGV4dCk7ZWxlbWVudC5hcHBlbmRDaGlsZChsYWJlbCl9LGRpc3BsYXlDcmVkaXRzOmZ1bmN0aW9uKCl7Y3JlZGl0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Y3JlZGl0LmNsYXNzTmFtZT1cImp4LWNyZWRpdFwiO3RleHQ9XCI8ZW0+UGhvdG8gQ3JlZGl0czo8L2VtPlwiO2lmKHRoaXMuaW1nQmVmb3JlLmNyZWRpdCl7dGV4dCs9XCIgPGVtPkJlZm9yZTwvZW0+IFwiK3RoaXMuaW1nQmVmb3JlLmNyZWRpdH1pZih0aGlzLmltZ0FmdGVyLmNyZWRpdCl7dGV4dCs9XCIgPGVtPkFmdGVyPC9lbT4gXCIrdGhpcy5pbWdBZnRlci5jcmVkaXR9Y3JlZGl0LmlubmVySFRNTD10ZXh0O3RoaXMud3JhcHBlci5hcHBlbmRDaGlsZChjcmVkaXQpfSxzZXRTdGFydGluZ1Bvc2l0aW9uOmZ1bmN0aW9uKHMpe3RoaXMub3B0aW9ucy5zdGFydGluZ1Bvc2l0aW9uPXN9LGNoZWNrSW1hZ2VzOmZ1bmN0aW9uKCl7aWYoZ2V0SW1hZ2VEaW1lbnNpb25zKHRoaXMuaW1nQmVmb3JlLmltYWdlKS5hc3BlY3QoKT09Z2V0SW1hZ2VEaW1lbnNpb25zKHRoaXMuaW1nQWZ0ZXIuaW1hZ2UpLmFzcGVjdCgpKXtyZXR1cm4gdHJ1ZX1lbHNle3JldHVybiBmYWxzZX19LHNldFdyYXBwZXJEaW1lbnNpb25zOmZ1bmN0aW9uKCl7cmF0aW89Z2V0SW1hZ2VEaW1lbnNpb25zKHRoaXMuaW1nQmVmb3JlLmltYWdlKS5hc3BlY3QoKTt3aWR0aD1nZXRDb21wdXRlZFdpZHRoQW5kSGVpZ2h0KHRoaXMud3JhcHBlcikud2lkdGg7aGVpZ2h0PWdldENvbXB1dGVkV2lkdGhBbmRIZWlnaHQodGhpcy53cmFwcGVyKS5oZWlnaHQ7aWYod2lkdGgpe2hlaWdodD13aWR0aC9yYXRpbzt0aGlzLndyYXBwZXIuc3R5bGUuaGVpZ2h0PXBhcnNlSW50KGhlaWdodCkrXCJweFwifWVsc2UgaWYoaGVpZ2h0KXt3aWR0aD1oZWlnaHQqcmF0aW87dGhpcy53cmFwcGVyLnN0eWxlLndpZHRoPXBhcnNlSW50KHdpZHRoKStcInB4XCJ9fSxfb25Mb2FkZWQ6ZnVuY3Rpb24oKXtpZih0aGlzLmltZ0JlZm9yZSYmdGhpcy5pbWdCZWZvcmUubG9hZGVkPT09dHJ1ZSYmdGhpcy5pbWdBZnRlciYmdGhpcy5pbWdBZnRlci5sb2FkZWQ9PT10cnVlKXt0aGlzLndyYXBwZXI9ZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yKTthZGRDbGFzcyh0aGlzLndyYXBwZXIsXCJqdXh0YXBvc2VcIik7dGhpcy53cmFwcGVyLnN0eWxlLndpZHRoPWdldE5hdHVyYWxEaW1lbnNpb25zKHRoaXMuaW1nQmVmb3JlLmltYWdlKS53aWR0aDt0aGlzLnNldFdyYXBwZXJEaW1lbnNpb25zKCk7dGhpcy5zbGlkZXI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLnNsaWRlci5jbGFzc05hbWU9XCJqeC1zbGlkZXJcIjt0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5zbGlkZXIpO2lmKHRoaXMub3B0aW9ucy5tb2RlIT1cImhvcml6b250YWxcIil7YWRkQ2xhc3ModGhpcy5zbGlkZXIsdGhpcy5vcHRpb25zLm1vZGUpfXRoaXMuaGFuZGxlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5oYW5kbGUuY2xhc3NOYW1lPVwiangtaGFuZGxlXCI7dGhpcy5yaWdodEltYWdlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5yaWdodEltYWdlLmNsYXNzTmFtZT1cImp4LWltYWdlIGp4LXJpZ2h0XCI7dGhpcy5yaWdodEltYWdlLmFwcGVuZENoaWxkKHRoaXMuaW1nQWZ0ZXIuaW1hZ2UpO3RoaXMubGVmdEltYWdlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5sZWZ0SW1hZ2UuY2xhc3NOYW1lPVwiangtaW1hZ2UgangtbGVmdFwiO3RoaXMubGVmdEltYWdlLmFwcGVuZENoaWxkKHRoaXMuaW1nQmVmb3JlLmltYWdlKTt0aGlzLmxhYkNyZWRpdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTt0aGlzLmxhYkNyZWRpdC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsXCJodHRwOi8vanV4dGFwb3NlLmtuaWdodGxhYi5jb21cIik7dGhpcy5sYWJDcmVkaXQuY2xhc3NOYW1lPVwiangta25pZ2h0bGFiXCI7dGhpcy5sYWJMb2dvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5sYWJMb2dvLmNsYXNzTmFtZT1cImtuaWdodGxhYi1sb2dvXCI7dGhpcy5sYWJDcmVkaXQuYXBwZW5kQ2hpbGQodGhpcy5sYWJMb2dvKTt0aGlzLnByb2plY3ROYW1lPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMucHJvamVjdE5hbWUuY2xhc3NOYW1lPVwianV4dGFwb3NlLW5hbWVcIjtzZXRUZXh0KHRoaXMucHJvamVjdE5hbWUsXCJKdXh0YXBvc2VKU1wiKTt0aGlzLmxhYkNyZWRpdC5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3ROYW1lKTt0aGlzLnNsaWRlci5hcHBlbmRDaGlsZCh0aGlzLmhhbmRsZSk7dGhpcy5zbGlkZXIuYXBwZW5kQ2hpbGQodGhpcy5sZWZ0SW1hZ2UpO3RoaXMuc2xpZGVyLmFwcGVuZENoaWxkKHRoaXMucmlnaHRJbWFnZSk7dGhpcy5zbGlkZXIuYXBwZW5kQ2hpbGQodGhpcy5sYWJDcmVkaXQpO3RoaXMubGVmdEFycm93PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5yaWdodEFycm93PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5jb250cm9sPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5jb250cm9sbGVyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5sZWZ0QXJyb3cuY2xhc3NOYW1lPVwiangtYXJyb3cgangtbGVmdFwiO3RoaXMucmlnaHRBcnJvdy5jbGFzc05hbWU9XCJqeC1hcnJvdyBqeC1yaWdodFwiO3RoaXMuY29udHJvbC5jbGFzc05hbWU9XCJqeC1jb250cm9sXCI7dGhpcy5jb250cm9sbGVyLmNsYXNzTmFtZT1cImp4LWNvbnRyb2xsZXJcIjt0aGlzLmNvbnRyb2xsZXIuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwwKTt0aGlzLmNvbnRyb2xsZXIuc2V0QXR0cmlidXRlKFwicm9sZVwiLFwic2xpZGVyXCIpO3RoaXMuY29udHJvbGxlci5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbm93XCIsNTApO3RoaXMuY29udHJvbGxlci5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbWluXCIsMCk7dGhpcy5jb250cm9sbGVyLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVtYXhcIiwxMDApO3RoaXMuaGFuZGxlLmFwcGVuZENoaWxkKHRoaXMubGVmdEFycm93KTt0aGlzLmhhbmRsZS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2wpO3RoaXMuaGFuZGxlLmFwcGVuZENoaWxkKHRoaXMucmlnaHRBcnJvdyk7dGhpcy5jb250cm9sLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlcik7dGhpcy5faW5pdCgpfX0sX2luaXQ6ZnVuY3Rpb24oKXtpZih0aGlzLmNoZWNrSW1hZ2VzKCk9PT1mYWxzZSl7Y29uc29sZS53YXJuKHRoaXMsXCJDaGVjayB0aGF0IHRoZSB0d28gaW1hZ2VzIGhhdmUgdGhlIHNhbWUgYXNwZWN0IHJhdGlvIGZvciB0aGUgc2xpZGVyIHRvIHdvcmsgY29ycmVjdGx5LlwiKX10aGlzLnVwZGF0ZVNsaWRlcih0aGlzLm9wdGlvbnMuc3RhcnRpbmdQb3NpdGlvbixmYWxzZSk7aWYodGhpcy5vcHRpb25zLnNob3dMYWJlbHM9PT10cnVlKXtpZih0aGlzLmltZ0JlZm9yZS5sYWJlbCl7dGhpcy5kaXNwbGF5TGFiZWwodGhpcy5sZWZ0SW1hZ2UsdGhpcy5pbWdCZWZvcmUubGFiZWwpfWlmKHRoaXMuaW1nQWZ0ZXIubGFiZWwpe3RoaXMuZGlzcGxheUxhYmVsKHRoaXMucmlnaHRJbWFnZSx0aGlzLmltZ0FmdGVyLmxhYmVsKX19aWYodGhpcy5vcHRpb25zLnNob3dDcmVkaXRzPT09dHJ1ZSl7dGhpcy5kaXNwbGF5Q3JlZGl0cygpfXZhciBzZWxmPXRoaXM7d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIixmdW5jdGlvbigpe3NlbGYuc2V0V3JhcHBlckRpbWVuc2lvbnMoKX0pO3RoaXMuc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixmdW5jdGlvbihlKXtlPWV8fHdpbmRvdy5ldmVudDtlLnByZXZlbnREZWZhdWx0KCk7c2VsZi51cGRhdGVTbGlkZXIoZSx0cnVlKTthbmltYXRlPXRydWU7dGhpcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsZnVuY3Rpb24oZSl7ZT1lfHx3aW5kb3cuZXZlbnQ7ZS5wcmV2ZW50RGVmYXVsdCgpO2lmKGFuaW1hdGUpe3NlbGYudXBkYXRlU2xpZGVyKGUsZmFsc2UpfX0pO2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsZnVuY3Rpb24oZSl7ZT1lfHx3aW5kb3cuZXZlbnQ7ZS5wcmV2ZW50RGVmYXVsdCgpO2FuaW1hdGU9ZmFsc2V9KX0pO3RoaXMuc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsZnVuY3Rpb24oZSl7ZT1lfHx3aW5kb3cuZXZlbnQ7ZS5wcmV2ZW50RGVmYXVsdCgpO3NlbGYudXBkYXRlU2xpZGVyKGUsdHJ1ZSk7dGhpcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsZnVuY3Rpb24oZSl7ZT1lfHx3aW5kb3cuZXZlbnQ7ZS5wcmV2ZW50RGVmYXVsdCgpO3NlbGYudXBkYXRlU2xpZGVyKGV2ZW50LGZhbHNlKX0pfSk7dGhpcy5oYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIixmdW5jdGlvbihlKXtlPWV8fHdpbmRvdy5ldmVudDt2YXIga2V5PWV2ZW50LndoaWNofHxldmVudC5rZXlDb2RlO3ZhciBhcmlhVmFsdWU9cGFyc2VGbG9hdCh0aGlzLnN0eWxlLmxlZnQpO2lmKGtleT09Mzcpe2FyaWFWYWx1ZT1hcmlhVmFsdWUtMTt2YXIgbGVmdFN0YXJ0PXBhcnNlRmxvYXQodGhpcy5zdHlsZS5sZWZ0KS0xO3NlbGYudXBkYXRlU2xpZGVyKGxlZnRTdGFydCxmYWxzZSk7c2VsZi5jb250cm9sbGVyLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVub3dcIixhcmlhVmFsdWUpfWlmKGtleT09Mzkpe2FyaWFWYWx1ZT1hcmlhVmFsdWUrMTt2YXIgcmlnaHRTdGFydD1wYXJzZUZsb2F0KHRoaXMuc3R5bGUubGVmdCkrMTtzZWxmLnVwZGF0ZVNsaWRlcihyaWdodFN0YXJ0LGZhbHNlKTtzZWxmLmNvbnRyb2xsZXIuc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW5vd1wiLGFyaWFWYWx1ZSl9fSk7dGhpcy5sZWZ0SW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIixmdW5jdGlvbihldmVudCl7dmFyIGtleT1ldmVudC53aGljaHx8ZXZlbnQua2V5Q29kZTtpZihrZXk9PTEzfHxrZXk9PTMyKXtzZWxmLnVwZGF0ZVNsaWRlcihcIjkwJVwiLHRydWUpO3NlbGYuY29udHJvbGxlci5zZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbm93XCIsOTApfX0pO3RoaXMucmlnaHRJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLGZ1bmN0aW9uKGV2ZW50KXt2YXIga2V5PWV2ZW50LndoaWNofHxldmVudC5rZXlDb2RlO2lmKGtleT09MTN8fGtleT09MzIpe3NlbGYudXBkYXRlU2xpZGVyKFwiMTAlXCIsdHJ1ZSk7c2VsZi5jb250cm9sbGVyLnNldEF0dHJpYnV0ZShcImFyaWEtdmFsdWVub3dcIiwxMCl9fSl9fTtqdXh0YXBvc2UubWFrZVNsaWRlcj1mdW5jdGlvbihlbGVtZW50LGlkeCl7aWYodHlwZW9mIGlkeD09XCJ1bmRlZmluZWRcIil7aWR4PWp1eHRhcG9zZS5zbGlkZXJzLmxlbmd0aH12YXIgdz1lbGVtZW50O3ZhciBpbWFnZXM9dy5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO3ZhciBvcHRpb25zPXt9O2lmKHcuZ2V0QXR0cmlidXRlKFwiZGF0YS1hbmltYXRlXCIpKXtvcHRpb25zLmFuaW1hdGU9dy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWFuaW1hdGVcIil9aWYody5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNob3dsYWJlbHNcIikpe29wdGlvbnMuc2hvd0xhYmVscz13LmdldEF0dHJpYnV0ZShcImRhdGEtc2hvd2xhYmVsc1wiKX1pZih3LmdldEF0dHJpYnV0ZShcImRhdGEtc2hvd2NyZWRpdHNcIikpe29wdGlvbnMuc2hvd0NyZWRpdHM9dy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNob3djcmVkaXRzXCIpfWlmKHcuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdGFydGluZ3Bvc2l0aW9uXCIpKXtvcHRpb25zLnN0YXJ0aW5nUG9zaXRpb249dy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXJ0aW5ncG9zaXRpb25cIil9aWYody5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIikpe29wdGlvbnMubW9kZT13LmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKX1zcGVjaWZpY0NsYXNzPVwianV4dGFwb3NlLVwiK2lkeDthZGRDbGFzcyhlbGVtZW50LHNwZWNpZmljQ2xhc3MpO3NlbGVjdG9yPVwiLlwiK3NwZWNpZmljQ2xhc3M7aWYody5pbm5lckhUTUwpe3cuaW5uZXJIVE1MPVwiXCJ9ZWxzZXt3LmlubmVyVGV4dD1cIlwifXNsaWRlcj1uZXcganV4dGFwb3NlLkpYU2xpZGVyKHNlbGVjdG9yLFt7c3JjOmltYWdlc1swXS5zcmMsbGFiZWw6aW1hZ2VzWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtbGFiZWxcIiksY3JlZGl0OmltYWdlc1swXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNyZWRpdFwiKX0se3NyYzppbWFnZXNbMV0uc3JjLGxhYmVsOmltYWdlc1sxXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWxhYmVsXCIpLGNyZWRpdDppbWFnZXNbMV0uZ2V0QXR0cmlidXRlKFwiZGF0YS1jcmVkaXRcIil9XSxvcHRpb25zKTtqdXh0YXBvc2Uuc2xpZGVycy5wdXNoKHNsaWRlcil9O2p1eHRhcG9zZS5zY2FuUGFnZT1mdW5jdGlvbigpe3ZhciBlbGVtZW50cz1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmp1eHRhcG9zZVwiKTtmb3IodmFyIGk9MDtpPGVsZW1lbnRzLmxlbmd0aDtpKyspe2p1eHRhcG9zZS5tYWtlU2xpZGVyKGVsZW1lbnRzW2ldLGkpfX07anV4dGFwb3NlLkpYU2xpZGVyPUpYU2xpZGVyO3dpbmRvdy5qdXh0YXBvc2U9anV4dGFwb3NlO2p1eHRhcG9zZS5zY2FuUGFnZSgpfSkoZG9jdW1lbnQsd2luZG93KTsoZnVuY3Rpb24od2luLGRvYyl7aWYod2luLmFkZEV2ZW50TGlzdGVuZXIpcmV0dXJuO2Z1bmN0aW9uIGRvY0hpamFjayhwKXt2YXIgb2xkPWRvY1twXTtkb2NbcF09ZnVuY3Rpb24odil7cmV0dXJuIGFkZExpc3RlbihvbGQodikpfX1mdW5jdGlvbiBhZGRFdmVudChvbixmbixzZWxmKXtyZXR1cm4oc2VsZj10aGlzKS5hdHRhY2hFdmVudChcIm9uXCIrb24sZnVuY3Rpb24oZSl7dmFyIGU9ZXx8d2luLmV2ZW50O2UucHJldmVudERlZmF1bHQ9ZS5wcmV2ZW50RGVmYXVsdHx8ZnVuY3Rpb24oKXtlLnJldHVyblZhbHVlPWZhbHNlfTtlLnN0b3BQcm9wYWdhdGlvbj1lLnN0b3BQcm9wYWdhdGlvbnx8ZnVuY3Rpb24oKXtlLmNhbmNlbEJ1YmJsZT10cnVlfTtmbi5jYWxsKHNlbGYsZSl9KX1mdW5jdGlvbiBhZGRMaXN0ZW4ob2JqLGkpe2lmKGk9b2JqLmxlbmd0aCl3aGlsZShpLS0pb2JqW2ldLmFkZEV2ZW50TGlzdGVuZXI9YWRkRXZlbnQ7ZWxzZSBvYmouYWRkRXZlbnRMaXN0ZW5lcj1hZGRFdmVudDtyZXR1cm4gb2JqfWFkZExpc3RlbihbZG9jLHdpbl0pO2lmKFwiRWxlbWVudFwiaW4gd2luKXdpbi5FbGVtZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyPWFkZEV2ZW50O2Vsc2V7ZG9jLmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24oKXthZGRMaXN0ZW4oZG9jLmFsbCl9KTtkb2NIaWphY2soXCJnZXRFbGVtZW50c0J5VGFnTmFtZVwiKTtkb2NIaWphY2soXCJnZXRFbGVtZW50QnlJZFwiKTtkb2NIaWphY2soXCJjcmVhdGVFbGVtZW50XCIpO2FkZExpc3Rlbihkb2MuYWxsKX19KSh3aW5kb3csZG9jdW1lbnQpOyJdfQ==