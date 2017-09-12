let data = {
	showMenu: true,
	checklists: { "h7F1oiV0": { title: "My List", items: [] }},
	listId: "h7F1oiV0",
	displayedList: {
		title: "Default List",
		items: []
	}
}

Vue.component('navigation', {
	template: '#navigationTemplate',
	data: function() {
		return data;
	},
	watch: {
		showMenu: function (val) {
			if (val)
				this.getLists();
		}
	},
	methods: {
		displayList: function(key) {
			this.listId = key;
			this.showMenu = false;
		},
		getLists: function() {
			return this.checklists = JSON.parse(localStorage.checklists || "{}");
		},
		saveLists: function(lists) {
			localStorage.checklists = JSON.stringify(lists);
			this.getLists();
		},
		createChecklist: function() {
			const listId = new Date().getTime().toString(36);
			let lists = this.getLists();
			lists[listId] = {
				title: "New Checklist",
				items: []
			}
			this.saveLists(lists);
			this.displayList(listId);
		},
		deleteChecklist: function(key) {
			let lists = this.getLists();
			delete lists[key];
			this.saveLists(lists);
		}
	},
	created: function() {
		this.getLists();
	}
});

Vue.component('checklist', {
	template: '#checklistTemplate',
	data: function() {
		return data;
	},
	watch: {
		displayedList: {
			handler: function() {
				this.save();
			},
			deep: true
		}
	},
	methods: {
		save: function() {
			let lists = JSON.parse(localStorage.checklists || "{}");
			lists[this.listId] = this.displayedList;
			localStorage.checklists = JSON.stringify(lists);
		},
		load: function() {
			const listId = this.listId;
			const checklists = JSON.parse(localStorage.checklists || "{}");
			this.displayedList = checklists[listId] || { title: "Checklist not found", items: [] }
		},
		addItem: function(event) {
			this.displayedList.items.push({ text: event.target.value, complete: false });
			event.target.value = "";
		},
		refocus: function(event) {
			setTimeout(() => event.target.focus(), 200);
		},
		defocus: function(event) {
			document.activeElement.blur();
		},
		deleteItem: function(key) {
			this.displayedList.items.splice(key,1);
			this.save();
		}
	},
	created: function() {
		this.load();
	}
});

new Vue({
	el: '#routeManager',
	data: function() {
		return data;
	},
	watch: {
		showMenu: function() {
			this.updateState();
		}
	},
	methods: {
		updateState: function(replace = false) {
			const params = [
				{ listId: this.listId, showMenu: this.showMenu },
				"",
				this.showMenu ? "/" : "?" + this.listId
			];
			
			if (replace) {
				history.replaceState(...params);
			} else {
				history.pushState(...params);
			}
		},
		popstate: function(event) {
			const state = event.state;
			if (!state) {
				this.showMenu = true;
				return;
			}

			this.showMenu = state.showMenu;
			this.listId = state.listId;
		}
	},
	created: function() {
		const listId = document.location.search.replace("?", "");
		if (listId) {
			this.showMenu = false;
			this.listId = listId;
			this.updateState(true);
		} else {
			this.showMenu = true;
		}

		window.addEventListener("popstate", this.popstate.bind(this));
	}
});
