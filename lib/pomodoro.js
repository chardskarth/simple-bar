import * as Uebersicht from 'uebersicht'
import * as Settings from './settings'
import * as Utils from './utils'


const pomodoroPath = "/Users/rgdpro/go/bin/pomodoro"

export const startPomo = (duration = "") => Uebersicht.run(`${pomodoroPath} start ${duration}`)

export const finishPomo = () => Uebersicht.run(`${pomodoroPath} finish`)

const getFormat = (format) => (format && `--format=${format}`) || ""
export const getPomoStatus
	= (format = "") => Uebersicht.run(`${pomodoroPath} status ${getFormat(format)} | tr -d '\n'`)


