(this.webpackJsonptestazureapp=this.webpackJsonptestazureapp||[]).push([[0],[,,,,,,function(e,t,n){e.exports=n.p+"static/media/ipl2020.227bb238.jfif"},function(e,t,n){e.exports={EntryForm:"EntryForm_EntryForm__Mgl4v"}},,,,function(e,t,n){e.exports=n(18)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),l=n(3),o=n.n(l),c=(n(16),n(8)),m=n(1),u=n(4),i=n(5),s=n(10),p=n(9),h=n(6),d=n.n(h),f=(n(17),n(7)),E=n.n(f),v=function(e){var t=e.formSubmit,n=e.nameInput,a=e.teamInput,l=e.handleNameChange,o=e.handleTeamChange;return r.a.createElement("div",{className:E.a.EntryForm},r.a.createElement("h3",null,"MI vs CSK"),r.a.createElement("p",null,"Enter your prediction"),r.a.createElement("input",{placeholder:"Name",value:n,name:"Name",onChange:l}),r.a.createElement("select",{name:"Team",value:a,onChange:o},r.a.createElement("option",{value:"select"},"--Select--"),r.a.createElement("option",{value:"MI"},"MI"),r.a.createElement("option",{value:"CSK"},"CSK")),r.a.createElement("div",null,r.a.createElement("button",{type:"submit",disabled:"--select--"==a||""==a||""==n,onClick:function(e){t(n,a)}},"Submit")))};v.defaultProps={};var b=v;var g=function(e){Object(s.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(u.a)(this,n),(a=t.call(this,e)).handleNameChange=function(e){a.setState(Object(m.a)(Object(m.a)(Object(m.a)({},a.state.ent),a.state.teamInput),{},{nameInput:e.target.value})),console.log(a.state.nameInput)},a.handleTeamChange=function(e){a.setState(Object(m.a)(Object(m.a)(Object(m.a)({},a.state.ent),a.state.nameInput),{},{teamInput:e.target.value})),console.log(a.state.teamInput)},a.formSubmit=function(e,t){console.log("Before",a.state);var n={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,team:t})};fetch("/api/entries",n).then((function(e){return e.json()})).then((function(n){return a.setState((function(n){var a=n.ent;if(a.some((function(t){return t.name.toLowerCase()===e.toLowerCase()}))){var r=a.findIndex((function(t){return t.name.toLowerCase()===e.toLowerCase()}));a[r]={name:a[r].name,team:t}}else a=[].concat(Object(c.a)(n.ent),[{name:n.nameInput,team:n.teamInput}]);return{ent:a,nameInput:"",teamInput:""}}))})),console.log("After",a.state)},a.state={ent:[],nameInput:"",teamInput:""},a}return Object(i.a)(n,[{key:"componentDidMount",value:function(){var e=this;fetch("/api/entries").then((function(e){return e.json()})).then((function(t){console.log("This is your data",t),e.setState((function(e){return{ent:t,nameInput:"",teamInput:""}}))}))}},{key:"TableRow",value:function(e){var t=e.entries;console.log("Entries",t);var n=t.map((function(e,t){return r.a.createElement("tr",{key:t},r.a.createElement("td",null,e.name),r.a.createElement("td",null,e.team),r.a.createElement("td",null,"0")," ")}));return r.a.createElement("tbody",null,n)}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(b,{formSubmit:this.formSubmit,nameInput:this.state.nameInput,teamInput:this.state.teamInput,handleNameChange:this.handleNameChange,handleTeamChange:this.handleTeamChange}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Name"),r.a.createElement("th",null,"Team"),r.a.createElement("th",null,"Score"))),r.a.createElement(this.TableRow,{entries:this.state.ent})))}}]),n}(r.a.Component),I=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("div",{id:"test",className:"App-body"},r.a.createElement("img",{src:d.a}),r.a.createElement("div",{id:"form1"}),r.a.createElement(g,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(I,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[11,1,2]]]);
//# sourceMappingURL=main.4dfe6fde.chunk.js.map