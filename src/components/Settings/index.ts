import {App, PluginSettingTab} from "obsidian";
import UniquePageNames from "../../main";
import {pluginConfig} from "../../plugin.config";

export class SettingsTab extends PluginSettingTab {
	plugin: UniquePageNames;

	constructor(app: App, plugin: UniquePageNames) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h1', {text: pluginConfig.name});
		containerEl.createEl('small', {text: pluginConfig.description});
		containerEl.createEl('br');
		containerEl.createEl('hr');

	}
}
