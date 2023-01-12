export interface Settings {
	pluginEnabled: boolean

	frontMatter: {
		update: boolean,
		data: {
			title: boolean,
			aliases: boolean
		}
	}
	customize: {
		file: {
			override: boolean,
			format: string
		}
		date: {
			enabled: boolean,
			format: string
		},
		prefix: {
			enabled: boolean,
			content: string
		},
		identifier: identifier
	}
}

export enum identifier {
	UUID,
	SHORT_UUID,
	DATE,
	MD5
}

export enum fileNameVariable {
	DATE = '{date}',
	IDENTIFIER = '{identifier}'
}

export const DEFAULT_SETTINGS: Settings = {
	frontMatter: {data: {title: true, aliases: false}, update: true},
	customize: {
		date: {enabled: false, format: ""},
		identifier: identifier.UUID,
		prefix: {content: "", enabled: false},
		file: {override: false, format: '{date}.{identifier}'}
	},
	pluginEnabled: false
}
