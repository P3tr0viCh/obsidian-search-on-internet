import { Plugin, Notice, PluginSettingTab, Setting } from 'obsidian';

import * as S from 'strings';

interface SearchOnInternetSettings {
	site: string;
}

const DEFAULT_SETTINGS: SearchOnInternetSettings = {
	site: 'https://yandex.ru/search?text='
}

export default class SearchOnInternetPlugin extends Plugin {
	settings: SearchOnInternetSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SearchOnInternetSettingTab(this));

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item
						.setTitle(S.MENU_SEARCH_ON_INTERNET)
						.setIcon('search')
						.onClick(async () => {
							const sel = editor.getSelection();

							if (sel) {
								//new Notice(`Open: ${this.settings.site} + ${sel}`);

								open(`https://yandex.ru/search?text=${sel}`);
							}
							else {
								new Notice(S.ERROR_SELECTION_EMPTY);
							}
						});
				});
			})
		);
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		if (!this.settings.site) this.settings.site = DEFAULT_SETTINGS.site;

		await this.saveData(this.settings);
	}
}

class SearchOnInternetSettingTab extends PluginSettingTab {
	plugin: SearchOnInternetPlugin;

	constructor(plugin: SearchOnInternetPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName(S.SETTING_SITE_NAME)
			.setDesc(S.SETTING_SITE_DEC)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.site)
					.onChange(async (value) => {
						this.plugin.settings.site = value;

						await this.plugin.saveSettings();
					})
			);
	}
}