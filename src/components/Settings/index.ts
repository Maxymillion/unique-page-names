import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import UniquePageNames from "../../main";
import {pluginConfig} from "../../plugin.config";
import {DEFAULT_SETTINGS, fileNameVariable} from "../../utils/types";

export class SettingsTab extends PluginSettingTab {
	plugin: UniquePageNames;

	constructor(app: App, plugin: UniquePageNames) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		const fileCompliance = /^\w+(?:\.\w+)*$/gm;

		containerEl.empty();
		containerEl.createEl('h1', {text: pluginConfig.name});
		let desc = containerEl.createEl('small', {text: pluginConfig.description + " "});
		desc.createEl('span', {text: pluginConfig.documentation.text.prefix});
		desc.createEl('a', {href: pluginConfig.documentation.link.url, text: pluginConfig.documentation.link.text});
		desc.createEl('span', {text: pluginConfig.documentation.text.suffix});
		containerEl.createEl('br');
		containerEl.createEl('br');

		new Setting(containerEl)
			.setHeading()
			.setName('General');

		new Setting(containerEl)
			.setName('Enable')
			.setDesc('Let the plugin rename files whenever the settings are met.')
			.addToggle(tg => tg
				.setValue(this.plugin.settings.pluginEnabled)
				.onChange(async (value) => {
					this.plugin.settings.pluginEnabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Allow plugin to edit frontmatter')
			.addToggle(tg => tg
				.setValue(this.plugin.settings.frontMatter.update)
				.onChange(async (value) => {
					this.plugin.settings.frontMatter.update = value;
					await this.plugin.saveSettings();
					this.display();
				}));

		new Setting(containerEl)
			.setHeading()
			.setClass(!this.plugin.settings.frontMatter.update ? "mm-setting-invisible" : "setting-visible")
			.setName('Frontmatter');

		new Setting(containerEl)
			.setClass(!this.plugin.settings.frontMatter.update ? "mm-setting-invisible" : "setting-visible")
			.setName('Add & update title property')
			.addToggle(tg => tg
				.setValue(this.plugin.settings.frontMatter.data.title)
				.onChange(async (value) => {
					this.plugin.settings.frontMatter.data.title = value;
				})
			);

		new Setting(containerEl)
			.setClass(!this.plugin.settings.frontMatter.update ? "mm-setting-invisible" : "setting-visible")
			.setName('Add & update aliases property')
			.addToggle(tg => tg
				.setValue(this.plugin.settings.frontMatter.data.aliases)
				.onChange(async (value) => {
					this.plugin.settings.frontMatter.data.aliases = value;
				})
			);

		new Setting(containerEl)
			.setHeading()
			.setName('Customize');

		new Setting(containerEl)
			.setName('Add date')
			.setDesc('Add a date to the filename: {date}.{identifier}.md')
			.addToggle(tg => tg
				.setValue(this.plugin.settings.customize.date.enabled)
				.onChange(async (value) => {
					this.plugin.settings.customize.date.enabled = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);

		new Setting(containerEl)
			.setClass(!this.plugin.settings.customize.date.enabled ? "mm-setting-invisible" : "setting-visible")
			.setName('Set date format')
			.addText(tc => tc
				.setPlaceholder('default: YYYY-MM-DD')
				.onChange(async (value) => {
					this.plugin.settings.customize.date.format = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Identifier')
			.setDesc('Select the type of identifier you want the plugin to use.')
			.addDropdown(dc => dc
				.addOption("uuid", "UUID")
				.addOption("short-uuid", "Short UUID")
				.addOption("md5", "MD5")
				.addOption("date", "Date")
			);

		new Setting(containerEl)
			.setName('Override filename template')
			.setDesc('Change the format, add a prefix, suffix to the filename.')
			.addToggle(tg => tg
				.setValue(this.plugin.settings.customize.file.override)
				.onChange(async (value) => {
					this.plugin.settings.customize.file.override = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);

		let internalFileNameTemplate = this.plugin.settings.customize.file.format;
		new Setting(containerEl)
			.setName('Set filename template')
			.setClass(!this.plugin.settings.customize.file.override ? "setting-invisible" : "setting-visible")
			.setDesc('Default: {date}.{identifier} (the file extension will be automatically added).')
			.addText(tg => tg
				.setValue(this.plugin.settings.customize.file.format)
				.onChange((input) => {
					const allowedInput = /^[\w&\{\}]+(?:\.[\w&\{\}]+)*$/gm;
					if (input.match(allowedInput)) {
						internalFileNameTemplate = input;
					} else {
						tg.setValue(internalFileNameTemplate);
					}
				})
			)
			.addButton(bc => bc
				.setIcon("sync")
				.onClick(async () => {
					let fT = internalFileNameTemplate;
					let variableGroup = /\{\w+\}/gm;
					fT.match(variableGroup)?.forEach((value) => {
						if (Object.values(fileNameVariable).includes(value as unknown as fileNameVariable)) {
							fT = fT.replace(value, "val");
						}
					})

					if (fileCompliance.exec(fT)) {
						this.plugin.settings.customize.file.format = internalFileNameTemplate;
						new Notice('Filename template updated!')
						await this.plugin.saveSettings();
					} else {
						new Notice('An error occurred while parsing filename template...')
					}
				})
			);

		new Setting(containerEl)
			.setHeading()
			.setName('Rules');

		new Setting(containerEl)
			.setName('Ignore Regex Rule')
			.setDesc('Blacklist files using a regex rule.')
			.addText(tc => tc
				.setPlaceholder('example: .*\\.bl\\.md')
			);

		let dangerZone = containerEl.createEl('div', {cls: "mm-dangerzone"})

		new Setting(dangerZone)
			.setHeading()
			.setName('Danger zone');

		new Setting(dangerZone)
			.setName('Factory reset')
			.setDesc('Revert the (plugin) settings to their default state, as the plugin was installed.')
			.addButton(bc => bc
				.setWarning()
				.setButtonText("Reset plugin")
				.onClick(async () => {
					this.plugin.settings = DEFAULT_SETTINGS;
					await this.plugin.saveSettings();
					this.display();
				})
			);

		// new Setting(dangerZone)
		// 	.setName('Revert filenames')
		// 	.setDesc('Revert all files (which were touched by the plugin) to their original title.')
		// 	.addButton(bc => bc
		// 		.setWarning()
		// 		.setButtonText("Revert")
		// 		.onClick(() => {
		// 			new Notice('Not yet implemented!');
		// 		})
		// 	);
	}
}
