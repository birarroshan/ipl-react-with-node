(this.webpackJsonptestazureapp=this.webpackJsonptestazureapp||[]).push([[0],[,,,,,,function(e,t,a){e.exports=a.p+"static/media/ipl2020.227bb238.jfif"},function(e,t,a){e.exports={EntryForm:"EntryForm_EntryForm__Mgl4v"}},,,function(e,t,a){e.exports=a(17)},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(3),c=a.n(r),m=(a(15),a(1)),l=a(4),s=a(5),u=a(9),i=a(8),h=a(6),p=a.n(h),b=(a(16),a(7)),f=a.n(b),d=function(e){var t=e.formSubmit,a=e.nameInput,n=e.teamInput,r=e.handleNameChange,c=e.handleTeamChange,m=e.team1,l=e.team2;return o.a.createElement("div",{className:f.a.EntryForm},o.a.createElement("h3",null,m," vs ",l),o.a.createElement("p",null,"Enter your prediction"),o.a.createElement("input",{placeholder:"Name",value:a,name:"Name",onChange:r}),o.a.createElement("select",{name:"Team",value:n,onChange:c},o.a.createElement("option",{value:"select"},"--Select--"),o.a.createElement("option",{value:m},m),o.a.createElement("option",{value:l},l)),o.a.createElement("div",null,o.a.createElement("button",{type:"submit",disabled:"--select--"===n||""===n||""===a,onClick:function(e){t(a,n)}},"Submit")))};d.defaultProps={};var j=d;var E=function(e){Object(u.a)(a,e);var t=Object(i.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).handleNameChange=function(e){n.setState(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)({},n.state.ent),n.state.teamInput),n.state.team1),n.state.team2),n.showVotes),{},{nameInput:e.target.value})),console.log(n.state.nameInput)},n.handleTeamChange=function(e){n.setState(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)({},n.state.ent),n.state.nameInput),n.state.team1),n.state.team2),n.showVotes),{},{teamInput:e.target.value})),console.log(n.state.teamInput)},n.formSubmit=function(e,t){if(e=e.trim(),t=t.trim(),console.log("Before",n.state),(new Date).getHours()<19){var a={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,team:t})};fetch("/api/entries",a).then((function(e){return e.json()})).then((function(e){return n.setState((function(t){return{ent:e,nameInput:"",teamInput:"",team1:t.team1,team2:t.team2}}))})),console.log("After",n.state)}else alert("Submission Time is over")},n.state={ent:[],nameInput:"",teamInput:"",team1:"",team2:"",showVotes:!1},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var e=this;fetch("/api/players").then((function(e){return e.json()})).then((function(t){return console.log("This is player data",t),e.setState((function(a){return Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)({},e.state.ent),e.state.nameInput),e.state.teamInput),e.showVotes),{},{team1:t.team1,team2:t.team2})})),(new Date).getHours()>19&&e.setState((function(t){return Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)({},e.state.ent),e.state.nameInput),e.state.teamInput),e.state.team1),e.state.team2),{},{showVotes:!0})})),fetch("/api/entries").then((function(e){return e.json()})).then((function(t){return console.log("This is entries data",t),e.setState((function(a){return Object(m.a)(Object(m.a)(Object(m.a)({},e.state.team1),e.state.team2),{},{ent:t,nameInput:"",teamInput:""})})),setTimeout((function(){}),1e3),fetch("/api/matches").then((function(e){return e.json()})).then((function(t){console.log("This is Match Data",t),e.setState((function(a){return Object(m.a)(Object(m.a)(Object(m.a)(Object(m.a)({},e.state.ent),e.state.nameInput),e.state.teamInput),{},{team1:t.team1,team2:t.team2})}))}))}))}))}},{key:"TableRow",value:function(e){console.log("Tbale row",e);var t=e.entries.ent;console.log("Entries",t);var a=t.map((function(t,a){return o.a.createElement("tr",{key:a},o.a.createElement("td",null,t.name),o.a.createElement("td",null,""===t.team?"":e.entries.showVotes?t.team:"Voted"," "),o.a.createElement("td",null,"0")," ")}));return o.a.createElement("tbody",null,a)}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(j,{formSubmit:this.formSubmit,nameInput:this.state.nameInput,teamInput:this.state.teamInput,handleNameChange:this.handleNameChange,handleTeamChange:this.handleTeamChange,team1:this.state.team1,team2:this.state.team2}),o.a.createElement("br",null),o.a.createElement("br",null),o.a.createElement("table",null,o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",null,"Name"),o.a.createElement("th",null,"Team"),o.a.createElement("th",null,"Score"))),o.a.createElement(this.TableRow,{entries:this.state})))}}]),a}(o.a.Component),O=function(){return o.a.createElement("div",{className:"App"},o.a.createElement("div",{id:"test",className:"App-body"},o.a.createElement("img",{src:p.a}),o.a.createElement("div",{id:"form1"}),o.a.createElement(E,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(O,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[10,1,2]]]);
//# sourceMappingURL=main.53fa367e.chunk.js.map