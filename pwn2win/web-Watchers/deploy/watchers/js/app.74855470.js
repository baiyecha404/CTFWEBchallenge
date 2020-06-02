(function(t){function e(e){for(var n,i,s=e[0],c=e[1],d=e[2],l=0,p=[];l<s.length;l++)i=s[l],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&p.push(r[i][0]),r[i]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);u&&u(e);while(p.length)p.shift()();return o.push.apply(o,d||[]),a()}function a(){for(var t,e=0;e<o.length;e++){for(var a=o[e],n=!0,s=1;s<a.length;s++){var c=a[s];0!==r[c]&&(n=!1)}n&&(o.splice(e--,1),t=i(i.s=a[0]))}return t}var n={},r={app:0},o=[];function i(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=t,i.c=n,i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(a,n,function(e){return t[e]}.bind(null,n));return a},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var d=0;d<s.length;d++)e(s[d]);var u=c;o.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"0ba9":function(t,e,a){"use strict";var n=a("f120"),r=a.n(n);r.a},"1a12":function(t,e,a){},"25f7":function(t,e,a){},4425:function(t,e,a){"use strict";var n=a("804f"),r=a.n(n);r.a},"4d90":function(t,e,a){"use strict";var n=a("f962"),r=a.n(n);r.a},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var n=a("2b0e"),r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("Navbar"),a("router-view")],1)},o=[],i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("md-toolbar",{staticClass:"md-accent",attrs:{"md-elevation":"1"}},[a("router-link",{staticClass:"brand",attrs:{to:{name:"main"}}},[a("h2",{staticClass:"md-title",staticStyle:{flex:"-1"}},[t._v("Static Web Host")])]),a("md-button",{staticClass:"md-primary md-buttons",attrs:{to:{name:"main"}}},[t._v("Home")]),a("md-button",{staticClass:"md-buttons",attrs:{to:{name:"check"}}},[t._v("Check")]),a("md-button",{staticClass:"md-buttons",attrs:{to:{name:"support"}}},[t._v("Bug Report")])],1)],1)},s=[],c={},d=c,u=(a("5dfc"),a("2877")),l=Object(u["a"])(d,i,s,!1,null,null,null),p=l.exports,f={components:{Navbar:p}},h=f,m=(a("5c8e"),Object(u["a"])(h,r,o,!1,null,"449e3037",null)),v=m.exports,b=a("43f9"),y=a.n(b),g=a("8c4f"),k=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[t.error.display?a("md-toolbar",{staticClass:"md-accent error"},[a("h3",{staticClass:"md-title"},[t._v(t._s(t.error.data))])]):t._e(),a("PageEditor",{on:{"update:home":function(e){return t.updateHome(e)},"update:about":function(e){return t.updateAbout(e)},"update:contact":function(e){return t.updateContact(e)}}}),a("div",{attrs:{id:"container"}},[a("md-button",{staticClass:"md-buttons weaponlyzer",on:{click:t.upload}},[t._v("Weaponlyzer")]),a("vue-recaptcha",{staticClass:"recaptcha",attrs:{sitekey:"6Ldr6vYUAAAAAGonpRXGwucElCqfCCCGTWIkie4x",loadRecaptchaScript:!0},on:{verify:t.onVerify}}),t._l(t.weapon.data,(function(e,n){return a("md-list",{key:e},[a("md-list-item",{staticClass:"wappalyzer-color"},[t._v(t._s(n))]),t._l(e,(function(e){return a("md-list-item",{key:e},[t._v(t._s(e.name)),a("code",{domProps:{innerHTML:t._s(e.version)}})])}))],2)}))],2),a("md-snackbar",{attrs:{"md-active":t.sent},on:{"update:mdActive":function(e){t.sent=e},"update:md-active":function(e){t.sent=e}}},[t._v("Analyzing your application technologies")])],1)},_=[],w=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{attrs:{id:"content"}},[a("md-tabs",{attrs:{"md-theme":"default-dark"}},[a("md-tab",{staticClass:"editor-tabs",attrs:{id:"tab-home","md-label":"Home","md-theme":"default-dark",exact:""}},[a("Editor",{attrs:{"default-value":t.main},on:{changeValue:function(e){return t.updateValue(e,"home")}}})],1),a("md-tab",{staticClass:"editor-tabs",attrs:{id:"tab-about","md-label":"About"}},[a("Editor",{attrs:{"default-value":t.about},on:{changeValue:function(e){return t.updateValue(e,"about")}}})],1),a("md-tab",{staticClass:"editor-tabs",attrs:{id:"tab-contact","md-label":"Contact"}},[a("Editor",{attrs:{"default-value":t.contact},on:{changeValue:function(e){return t.updateValue(e,"contact")}}})],1)],1)],1)])},C=[],E=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("prism-editor",{staticClass:"disabled-editor",staticStyle:{height:"140px","background-color":"#424242"},attrs:{code:t.pre,readonly:"",language:"html"}}),a("prism-editor",{staticStyle:{height:"150px"},attrs:{code:t.value,language:"html"},on:{change:function(e){return t.$emit("changeValue",e)}}}),a("prism-editor",{staticClass:"disabled-editor",staticStyle:{height:"80px"},attrs:{code:t.pos,readonly:"",language:"html"}})],1)},x=[],A=a("431a"),S=a.n(A),O=(a("c197"),a("84bf"),a("fdfb"),{props:["defaultValue"],components:{PrismEditor:S.a},data:function(){return{pre:'<html>\n    <head>\n        <meta http-equiv="Content-Security-Policy" content="default-src \'none\';">\n    </head>\n    <body>',pos:"    </body>\n<html>",value:""}},mounted:function(){this.value=this.defaultValue}}),V=O,j=(a("b16a"),Object(u["a"])(V,E,x,!1,null,null,null)),H=j.exports,$={components:{Editor:H},data:function(){return{main:" <h1>Hackers must die!!1</h1>\n\nOur service helps to identify vulnerable technologies - check it out!",about:"Static Web Hosting helped me monitor the technologies I am currently using so I can stay safe™",contact:"Who watches the watchmen?\n\nemail me at secure@concerned.dev"}},methods:{updateValue:function(t,e){this.$emit("update:"+e,t)}}},P=$,R=(a("632d"),Object(u["a"])(P,w,C,!1,null,"09827e2b",null)),W=R.exports,z=a("e096"),G=a("bc3a"),I=a.n(G),T={components:{PageEditor:W,VueRecaptcha:z["a"]},data:function(){return{error:{display:!1,data:""},weapon:{display:!1,data:""},editor:{home:" <h1>Hackers must die!!1</h1>\n\nand other things you gonna learn in my three pages static site",about:"How weaponlyzer helped me to increase my security monitoring the technologies I use",contact:"please email me at secure@concerned.dev"},sent:!1,token:""}},methods:{upload:function(){var t=this;""!=this.token&&(this.sent=!0),this.error.display=!1,this.weapon.display=!1,I.a.post("/upload.php",{home:this.editor.home,about:this.editor.about,contact:this.editor.contact,"g-recaptcha-response":this.token}).then((function(e){t.error.display=!0,t.token="","content is too long"===e.data?t.error.data="Error: Unfortunately our Static Web Host doesn't support pages larger than 1500 characters :(":"redirects are not allowed"===e.data?t.error.data="Error: Our server currently cannot understand meta refresh :(":/Couldn't analyze your file/.test(e.data)?t.error.data=e.data:"invalid captcha"===e.data?t.error.data="Error: Invalid Recaptcha :/":e.data["Web servers"]?(t.sent=!0,t.error.display=!1,t.weapon.display=!0,t.weapon.data=e.data):t.error.data="Strange error, you must be a strange person"}))},updateHome:function(t){this.editor.home=t},updateAbout:function(t){this.editor.about=t},updateContact:function(t){this.editor.contact=t},onVerify:function(t){this.token=t}}},q=T,U=(a("0ba9"),Object(u["a"])(q,k,_,!1,null,"49528c89",null)),M=U.exports,L=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("md-card",[a("md-card-header",[a("div",{staticClass:"md-title"},[t._v("Service Support")])]),a("md-card-content",[t._v(" Are you having problems? Send your page to the admin so they can recheck your page with weaponlyzer in /check and look for any issues. ")])],1),a("form",{staticClass:"md-layout"},[a("md-field",{attrs:{"md-inline":""}},[a("label",{staticClass:"input"},[t._v("http://watcher.pwn2.win/pages/2555deea69c98b9188d8fccda991d5d3cef9e9a5e514a8b23f906d078f2a7545/0b1ff1fbca9c.html")]),a("span",{staticClass:"md-prefix"},[t._v("http://watcher.pwn2.win/")]),a("md-input",{staticClass:"input",model:{value:t.initial,callback:function(e){t.initial=e},expression:"initial"}}),a("md-card-actions",[a("md-button",{staticClass:"md-primary",on:{click:t.send}},[t._v("Send")])],1)],1),a("vue-recaptcha",{attrs:{sitekey:"6Ldr6vYUAAAAAGonpRXGwucElCqfCCCGTWIkie4x",loadRecaptchaScript:!0},on:{verify:t.onVerify}}),a("md-snackbar",{attrs:{"md-active":t.sent},on:{"update:mdActive":function(e){t.sent=e},"update:md-active":function(e){t.sent=e}}},[t._v(t._s(t.message))])],1)],1)},X=[],Y={components:{VueRecaptcha:z["a"]},data:function(){return{initial:"",empty:"",sent:!1,token:"",message:"Admin will check your url"}},methods:{send:function(){var t=this;I.a.post("/contact.php",{page:this.initial,"g-recaptcha-response":this.token}).then((function(e){200==e.status&&("invalid captcha"===e.data&&(t.message="Invalid captcha!"),t.sent=!0)}))},onVerify:function(t){this.token=t}}},J=Y,N=(a("4425"),Object(u["a"])(J,L,X,!1,null,"2d0c7273",null)),B=N.exports,D=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("form",{attrs:{method:"GET",action:"/check"}},[a("md-field",{attrs:{"md-inline":""}},[a("span",{staticClass:"md-prefix"},[t._v("http://watcher.pwn2.win/")]),a("md-input",{staticClass:"input",attrs:{name:"url"},model:{value:t.initial,callback:function(e){t.initial=e},expression:"initial"}}),a("md-card-actions",[a("md-button",{staticClass:"md-primary",on:{click:t.checkUrl}},[t._v("Check")])],1)],1),a("vue-recaptcha",{attrs:{sitekey:"6Ldr6vYUAAAAAGonpRXGwucElCqfCCCGTWIkie4x",loadRecaptchaScript:!0},on:{verify:t.onVerify}})],1),a("div",{attrs:{id:"container"}},[a("h3",{staticClass:"md-title"},[t._v(t._s(t.error.data))]),t._l(t.weapon.data,(function(e,n){return a("md-list",{key:e},[a("md-list-item",{staticClass:"wappalyzer-color",attrs:{name:"url"}},[t._v(t._s(n))]),t._l(e,(function(e){return a("md-list-item",{key:e},[t._v(t._s(e.name)),a("code",{domProps:{innerHTML:t._s(e.version)}})])}))],2)}))],2)])},F=[],K={components:{VueRecaptcha:z["a"]},data:function(){return{initial:"pages/2555deea69c98b9188d8fccda991d5d3cef9e9a5e514a8b23f906d078f2a7545/0b1ff1fbca9c.html",empty:"",weapon:{display:!1,data:""},error:{display:!1,data:""},token:""}},mounted:function(){var t=this;this.$route.query.url&&this.$route.query.token&&I.a.post("/check.php",{url:this.$route.query.url,token:this.$route.query.token}).then((function(e){t.error.display=!0,"content is too long"===e.data?t.error.data="Error: Unfortunately our Static Web Host doesn't support pages larger than 1500 characters :(":"redirects are not allowed"===e.data?t.error.data="Error: Our server currently cannot understand meta refresh :(":/Couldn't analyze your file/.test(e.data)?t.error.data=e.data:(t.error.display=!1,t.weapon.display=!0,t.weapon.data=e.data)}))},methods:{checkUrl:function(){var t=this;I.a.post("/check.php",{url:this.initial,"g-recaptcha-response":this.token}).then((function(e){t.error.display=!0,"content is too long"===e.data?t.error.data="Error: Unfortunately our Static Web Host doesn't support pages larger than 1500 characters :(":"redirects are not allowed"===e.data?t.error.data="Error: Our server currently cannot understand meta refresh :(":"invalid captcha"===e.data?t.error.data="Error: Invalid Recaptcha :/":/Couldn't analyze your file/.test(e.data)?t.error.data=e.data:(t.error.display=!1,t.weapon.display=!0,t.weapon.data=e.data)}))},onVerify:function(t){this.token=t}}},Q=K,Z=(a("4d90"),Object(u["a"])(Q,D,F,!1,null,"3834112e",null)),tt=Z.exports;n["default"].use(g["a"]);var et=[{path:"/",name:"main",component:M},{path:"/support",name:"support",component:B},{path:"/check",name:"check",component:tt}],at=new g["a"]({mode:"history",base:"/",routes:et}),nt=at;a("43f4"),a("e094");n["default"].config.productionTip=!1,n["default"].use(y.a),new n["default"]({router:nt,render:function(t){return t(v)}}).$mount("#app")},"5c8e":function(t,e,a){"use strict";var n=a("b428"),r=a.n(n);r.a},"5dfc":function(t,e,a){"use strict";var n=a("1a12"),r=a.n(n);r.a},"632d":function(t,e,a){"use strict";var n=a("660e"),r=a.n(n);r.a},"660e":function(t,e,a){},"804f":function(t,e,a){},b16a:function(t,e,a){"use strict";var n=a("25f7"),r=a.n(n);r.a},b428:function(t,e,a){},f120:function(t,e,a){},f962:function(t,e,a){}});
//# sourceMappingURL=app.74855470.js.map