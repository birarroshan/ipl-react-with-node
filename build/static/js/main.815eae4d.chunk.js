(this.webpackJsonptestazureapp=this.webpackJsonptestazureapp||[]).push([[0],[,,,,,,function(e,t,a){e.exports=a.p+"static/media/ipl2020.227bb238.jfif"},function(e,t,a){e.exports={EntryForm:"EntryForm_EntryForm__Mgl4v"}},,,function(e,t,a){e.exports=a(17)},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(3),l=a.n(c),o=(a(15),a(1)),m=a(4),u=a(5),s=a(9),i=a(8),h=a(6),p=a.n(h),f=(a(16),a(7)),b=a.n(f),d=function(e){var t=e.formSubmit,a=e.nameInput,n=e.teamInput,c=e.handleNameChange,l=e.handleTeamChange,o=e.team1,m=e.team2;return r.a.createElement("div",{className:b.a.EntryForm},r.a.createElement("h3",null,o," vs ",m),r.a.createElement("p",null,"Enter your prediction"),r.a.createElement("input",{placeholder:"Name",value:a,name:"Name",onChange:c}),r.a.createElement("select",{name:"Team",value:n,onChange:l},r.a.createElement("option",{value:"select"},"--Select--"),r.a.createElement("option",{value:o},o),r.a.createElement("option",{value:m},m)),r.a.createElement("div",null,r.a.createElement("button",{type:"submit",disabled:"--select--"===n||""===n||""===a,onClick:function(e){t(a,n)}},"Submit")))};d.defaultProps={};var E=d;var v=function(e){Object(s.a)(a,e);var t=Object(i.a)(a);function a(e){var n;return Object(m.a)(this,a),(n=t.call(this,e)).handleNameChange=function(e){n.setState(Object(o.a)(Object(o.a)(Object(o.a)(Object(o.a)(Object(o.a)({},n.state.ent),n.state.teamInput),n.state.team1),n.state.team2),{},{nameInput:e.target.value})),console.log(n.state.nameInput)},n.handleTeamChange=function(e){n.setState(Object(o.a)(Object(o.a)(Object(o.a)(Object(o.a)(Object(o.a)({},n.state.ent),n.state.nameInput),n.state.team1),n.state.team2),{},{teamInput:e.target.value})),console.log(n.state.teamInput)},n.formSubmit=function(e,t){if(console.log("Before",n.state),(new Date).getHours()<19){var a={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,team:t})};fetch("/api/entries",a).then((function(e){return e.json()})).then((function(e){return n.setState((function(t){return{ent:e,nameInput:"",teamInput:"",team1:t.team1,team2:t.team2}}))})),console.log("After",n.state)}else alert("Submission Time is over")},n.state={ent:[],nameInput:"",teamInput:"",team1:"",team2:""},n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){var e=this;fetch("/api/players").then((function(e){return e.json()})).then((function(t){return console.log("This is player data",t),e.setState((function(a){return Object(o.a)(Object(o.a)(Object(o.a)(Object(o.a)({},e.state.ent),e.state.nameInput),e.state.teamInput),{},{team1:t.team1,team2:t.team2})})),fetch("/api/entries").then((function(e){return e.json()})).then((function(t){return console.log("This is entries data",t),e.setState((function(a){return Object(o.a)(Object(o.a)(Object(o.a)({},e.state.team1),e.state.team2),{},{ent:t,nameInput:"",teamInput:""})})),fetch("/api/matches").then((function(e){return e.json()})).then((function(t){console.log("This is Match Data",t),e.setState((function(a){return Object(o.a)(Object(o.a)(Object(o.a)(Object(o.a)({},e.state.ent),e.state.nameInput),e.state.teamInput),{},{team1:t.team1,team2:t.team2})}))}))}))}))}},{key:"TableRow",value:function(e){var t=e.entries;t.array.forEach((function(e){""!=e.team&&(e.team="Voted")})),console.log("Entries",t);var a=t.map((function(e,t){return r.a.createElement("tr",{key:t},r.a.createElement("td",null,e.name),r.a.createElement("td",null),r.a.createElement("td",null,"0")," ")}));return r.a.createElement("tbody",null,a)}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(E,{formSubmit:this.formSubmit,nameInput:this.state.nameInput,teamInput:this.state.teamInput,handleNameChange:this.handleNameChange,handleTeamChange:this.handleTeamChange,team1:this.state.team1,team2:this.state.team2}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Name"),r.a.createElement("th",null,"Team"),r.a.createElement("th",null,"Score"))),r.a.createElement(this.TableRow,{entries:this.state.ent})))}}]),a}(r.a.Component),j=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("div",{id:"test",className:"App-body"},r.a.createElement("img",{src:p.a}),r.a.createElement("div",{id:"form1"}),r.a.createElement(v,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(j,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[10,1,2]]]);
//# sourceMappingURL=main.815eae4d.chunk.js.map