import {Editor, MarkdownView, Notice, Plugin, TFile} from 'obsidian';
import {DEFAULT_SETTINGS, Settings} from "./utils/types";
import {SettingsTab} from "./components/Settings";

export const pluginName = "Unique Page Names";

export default class UniquePageNames extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



