(this.webpackJsonptestazureapp=this.webpackJsonptestazureapp||[]).push([[0],[,,,,,,function(e,t,a){e.exports=a.p+"static/media/ipl2020.227bb238.jfif"},function(e,t,a){e.exports={EntryForm:"EntryForm_EntryForm__Mgl4v"}},,,,function(e,t,a){e.exports=a(18)},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(3),m=a.n(o),c=(a(16),a(8)),l=a(1),u=a(4),s=a(5),i=a(10),h=a(9),p=a(6),f=a.n(p),b=(a(17),a(7)),d=a.n(b),E=function(e){var t=e.formSubmit,a=e.nameInput,n=e.teamInput,o=e.handleNameChange,m=e.handleTeamChange,c=e.team1,l=e.team2;return r.a.createElement("div",{className:d.a.EntryForm},r.a.createElement("h3",null,c," vs ",l),r.a.createElement("p",null,"Enter your prediction"),r.a.createElement("input",{placeholder:"Name",value:a,name:"Name",onChange:o}),r.a.createElement("select",{name:"Team",value:n,onChange:m},r.a.createElement("option",{value:"select"},"--Select--"),r.a.createElement("option",{value:l},c),r.a.createElement("option",{value:l},l)),r.a.createElement("div",null,r.a.createElement("button",{type:"submit",disabled:"--select--"===n||""===n||""===a,onClick:function(e){t(a,n)}},"Submit")))};E.defaultProps={};var v=E;var j=function(e){Object(i.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).handleNameChange=function(e){n.setState(Object(l.a)(Object(l.a)(Object(l.a)(Object(l.a)(Object(l.a)({},n.state.ent),n.state.teamInput),n.state.team1),n.state.team2),{},{nameInput:e.target.value})),console.log(n.state.nameInput)},n.handleTeamChange=function(e){n.setState(Object(l.a)(Object(l.a)(Object(l.a)(Object(l.a)(Object(l.a)({},n.state.ent),n.state.nameInput),n.state.team1),n.state.team2),{},{teamInput:e.target.value})),console.log(n.state.teamInput)},n.formSubmit=function(e,t){console.log("Before",n.state);var a=new Date;if(a.getHours()<19&&a.getMinutes()<15){var r={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,team:t})};fetch("/api/entries",r).then((function(e){return e.json()})).then((function(a){return n.setState((function(a){var n=a.ent;if(n.some((function(t){return t.name.toLowerCase()===e.toLowerCase()}))){var r=n.findIndex((function(t){return t.name.toLowerCase()===e.toLowerCase()}));n[r]={name:n[r].name,team:t}}else n=[].concat(Object(c.a)(a.ent),[{name:a.nameInput,team:a.teamInput}]);return{ent:n,nameInput:"",teamInput:"",team1:a.team1,team2:a.team2}}))})),console.log("After",n.state)}else alert("Submission Time is over")},n.state={ent:[],nameInput:"",teamInput:"",team1:"",team2:""},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var e=this;fetch("/api/entries").then((function(e){return e.json()})).then((function(t){console.log("This is your data",t),e.setState((function(a){return Object(l.a)(Object(l.a)(Object(l.a)({},e.state.team1),e.state.team2),{},{ent:t,nameInput:"",teamInput:""})}))}));fetch("/api/matches").then((function(e){return e.json()})).then((function(t){console.log("This is your data",t),e.setState((function(a){return Object(l.a)(Object(l.a)(Object(l.a)(Object(l.a)({},e.state.ent),e.state.nameInput),e.state.teamInput),{},{team1:t.team1,team2:t.team2})}))}));fetch("/api/players").then((function(e){return e.json()})).then((function(t){console.log("This is your data",t),e.setState((function(a){return Object(l.a)(Object(l.a)(Object(l.a)(Object(l.a)({},e.state.ent),e.state.nameInput),e.state.teamInput),{},{team1:t.team1,team2:t.team2})}))}))}},{key:"TableRow",value:function(e){var t=e.entries;console.log("Entries",t);var a=t.map((function(e,t){return r.a.createElement("tr",{key:t},r.a.createElement("td",null,e.name),r.a.createElement("td",null,e.team),r.a.createElement("td",null,"0")," ")}));return r.a.createElement("tbody",null,a)}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(v,{formSubmit:this.formSubmit,nameInput:this.state.nameInput,teamInput:this.state.teamInput,handleNameChange:this.handleNameChange,handleTeamChange:this.handleTeamChange,team1:this.state.team1,team2:this.state.team2}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Name"),r.a.createElement("th",null,"Team"),r.a.createElement("th",null,"Score"))),r.a.createElement(this.TableRow,{entries:this.state.ent})))}}]),a}(r.a.Component),g=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("div",{id:"test",className:"App-body"},r.a.createElement("img",{src:f.a}),r.a.createElement("div",{id:"form1"}),r.a.createElement(j,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));m.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(g,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[11,1,2]]]);
//# sourceMappingURL=main.11f6ad6f.chunk.js.map