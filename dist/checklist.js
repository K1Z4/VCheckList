"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function $(t){var e=document.querySelectorAll(t);return e?1===e.length?e[0]:e:console.error("No elements for selector '"+t+"'")}var CheckList=function t(){_classCallCheck(this,t);var e={showMenu:!0,checklists:{h7F1oiV0:{title:"My List",items:[]}},listId:"h7F1oiV0",displayedList:{title:"Default List",items:[]}};Vue.component("navigation",{template:"#navigationTemplate",data:function(){return e},watch:{showMenu:function(t){t&&this.getLists()}},methods:{displayList:function(t){this.listId=t,this.showMenu=!1},getLists:function(){this.checklists=JSON.parse(localStorage.checklists||"{}")},createChecklist:function(){var t=(new Date).getTime().toString(36),e=JSON.parse(localStorage.checklists||"{}");e[t]={title:"New Checklist",items:[]},localStorage.checklists=JSON.stringify(e),this.getLists()},deleteChecklist:function(t){var e=JSON.parse(localStorage.checklists||"{}");delete e[t],localStorage.checklists=JSON.stringify(e),this.getLists()}},created:function(){this.getLists()}}),Vue.component("checklist",{template:"#checklistTemplate",data:function(){return e},watch:{displayedList:{handler:function(){this.save()},deep:!0}},methods:{save:function(){var t=JSON.parse(localStorage.checklists||"{}");t[this.listId]=this.displayedList,localStorage.checklists=JSON.stringify(t)},load:function(){var t=this.listId,e=JSON.parse(localStorage.checklists||"{}");this.displayedList=e[t]||{title:"Checklist not found",items:[]}},addItem:function(t){this.displayedList.items.push({text:t.target.value,complete:!1}),t.target.value=""},refocus:function(t){setTimeout(function(){return t.target.focus()},200)},defocus:function(t){document.activeElement.blur()},deleteItem:function(t){this.displayedList.items.splice(t,1),this.save()}},created:function(){this.load()}}),this.routeManager=new Vue({el:"#routeManager",data:function(){return e},watch:{showMenu:function(){this.updateState()}},methods:{updateState:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=[{listId:this.listId,showMenu:this.showMenu},"",this.showMenu?"/":"?"+this.listId];if(t){var s;(s=history).replaceState.apply(s,e)}else{var i;(i=history).pushState.apply(i,e)}},popstate:function(t){t?(this.showMenu=t.showMenu,this.listId=t.listId):this.showMenu=!0}},created:function(){var t=this,e=document.location.search.replace("?","");e?(this.showMenu=!1,this.listId=e,this.updateState(!0)):this.showMenu=!0,window.addEventListener("popstate",function(e){t.popstate(e.state)})}})},checklist=new CheckList;