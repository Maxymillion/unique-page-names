import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import {DEFAULT_SETTINGS} from "../../utils/types";
import UniquePageNames, {pluginName} from "../../main";

export class SettingsTab extends PluginSettingTab {
	plugin: UniquePageNames;

	constructor(app: App, plugin: UniquePageNames) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h1', {text: pluginName});
		containerEl.createEl('small', {text: 'An Obsidian plugin to generate unique page names.'});
		containerEl.createEl('br');
		containerEl.createEl('hr');

	}
}
