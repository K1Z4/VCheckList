class Persistence {
	static saveLists(lists) {
		if (!lists) throw Error("lists parameter was not provided");
		localStorage.checklists = JSON.stringify(lists);
	}

	static loadLists() {
		return JSON.parse(localStorage.checklists || "{}");
	}
}

let data = {
	showMenu: true,
	checklists: { "h7F1oiV0": { title: "My List", items: [] }},
	listId: "h7F1oiV0"
}

Vue.component('navigation', {
	template: '#navigationTemplate',
	data: function() {
		return data;
	},
	watch: {
		showMenu: function (val) {
			if (val)
				this.loadLists();
		},
		checklists: {
			handler: "save",
			deep: true
		}
	},
	methods: {
		save: function() {
			Persistence.saveLists(this.checklists);
		},
		displayList: function(key) {
			this.listId = key;
			this.showMenu = false;
		},
		loadLists: function() {
			return this.checklists = Persistence.loadLists();
		},
		createChecklist: function() {
			const listId = new Date().getTime().toString(36);
			Vue.set(this.checklists, listId, {
				title: "New Checklist",
				items: []
			});
			this.save();
			this.displayList(listId);
		},
		deleteChecklist: function(key) {
			Vue.delete(this.checklists, key);
		}
	},
	created: function() {
		this.loadLists();
	}
});

Vue.component('checklist', {
	template: '#checklistTemplate',
	data: function() {
		return data;
	},
	computed: {
		displayedList: function() {
			return this.checklists[this.listId] || { title: 'List not found', items: [ { text: 'Return to the menu and create a new list', complete: false } ] };
		}
	},
	watch: {
		checklists: {
			handler: function() {
				Persistence.saveLists(this.checklists);
			},
			deep: true
		}
	},
	methods: {
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
		}
	},
	created: function() {
		this.checklists = Persistence.loadLists();
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
