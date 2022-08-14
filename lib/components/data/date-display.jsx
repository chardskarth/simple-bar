import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import * as Utils from '../../utils'
import * as Settings from '../../settings'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { dateStyles as styles } from '../../styles/components/data/date-display'

const refreshFrequency = 1000

const openCalendarApp = (calendarApp) => {
  const appName = calendarApp ? calendarApp : 'Calendar'
  Uebersicht.run(`open -a "${appName}"`)
}

const settings = Settings.get()

export const Widget = () => {
	const { widgets, dateWidgetOptions, timeWidgetOptions } = settings
  const { dateWidget, dateWidgetTimeWidget } = widgets
  const { shortDateFormat, locale, calendarApp } = dateWidgetOptions
  const { hour12, dayProgress, showSeconds } = timeWidgetOptions

  const [state, setState] = Uebersicht.React.useState()
  const [timeState, setTimeState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(dateWidget)
  const [timeLoading, setTimeLoading] = Uebersicht.React.useState(dateWidgetTimeWidget)

  const formatOptions = shortDateFormat ? 'short' : 'long'

  const options = {
    weekday: formatOptions,
    month: formatOptions,
    day: 'numeric',

    hour: 'numeric',
    minute: 'numeric',
    second: showSeconds ? 'numeric' : undefined,
    hour12
  }
  const _locale = locale.length > 4 ? locale : 'en-UK'

  const getDate = () => {
    const now = new Date().toLocaleDateString(_locale, options)
    setState({ now })
    setLoading(false)
  }

  const getTime = () => {
    const time = new Date().toLocaleString('en-UK', options)
    setTimeState({ time })
    setLoading(false)
  }

  useWidgetRefresh(dateWidget, getDate, refreshFrequency)
  useWidgetRefresh(dateWidgetTimeWidget, getTime, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="date-display" />
  if (!state) return null
  const { now } = state

  if (!timeState) return null
  const { time } = timeState

  const [dayStart, dayEnd] = [new Date(), new Date()]
  dayStart.setHours(0, 0, 0)
  dayEnd.setHours(0, 0, 0)
  dayEnd.setDate(dayEnd.getDate() + 1)
  const range = dayEnd - dayStart
  const diff = Math.max(0, dayEnd - new Date())
  const fillerWidth = (100 - (100 * diff) / range) / 100

  const onClick = (e) => {
    Utils.clickEffect(e)
    openCalendarApp(calendarApp)
  }

  return (
    <DataWidget.Widget classes="date-display time" Icon={Icons.Date} onClick={onClick}>
      {now}
      {dayProgress && <div className="time__filler" style={{ transform: `scaleX(${fillerWidth})` }} />}
    </DataWidget.Widget>
  )
}
