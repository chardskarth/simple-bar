import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Utils from '../../utils'
import * as Settings from '../../settings'
import { startPomo, getPomoStatus, finishPomo } from '../../pomodoro.js'

export { openPomodoroStyles as styles } from '../../styles/components/data/open-pomodoro'

const settings = Settings.get()
const { widgets, openPomodoroWidgetOptions } = settings
const { openPomodoroWidget } = widgets
const { refreshFrequency, pomodoroDuration } = openPomodoroWidgetOptions

const DEFAULT_REFRESH_FREQUENCY = 1000
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY)

const isPomodoroStatusStopped = (pomoStatusPercentR) => pomoStatusPercentR == ""

const tryToStartPomodoro = async () => {
	const pomodoroStatus = await getPomoStatus("%r")
	const isStopped = isPomodoroStatusStopped(pomodoroStatus)

  if (isStopped) {
		await startPomo()
    Utils.notification('Starting pomodoro...')
  } else {
		await finishPomo()
    Utils.notification('Pomodoro already started... finishing now')
  }
}

export const Widget = () => {
  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(openPomodoroWidget)

  const getPomodoroStatus = async () => {
		console.log("getting status")
    const [statusText] = await Promise.all([
      getPomoStatus("%r"),
    ])
    setState({
			isStopped: isPomodoroStatusStopped(statusText),
			statusText: (statusText == "" ? "Pomo Not Started": statusText),
    })
		console.log("fomr", statusText)
    setLoading(false)
  }

  useWidgetRefresh(openPomodoroWidget, getPomodoroStatus, REFRESH_FREQUENCY)
	console.log("dsafasdf ", REFRESH_FREQUENCY)

  if (loading) return <DataWidgetLoader.Widget className="openpomodoro" />
  if (!state) return null

  const { isStopped, statusText } = state

  const classes = Utils.classnames('openpomodoro', {
    'openpomodoro--notstarted': isStopped,
    'openpomodoro--started': !isStopped,
  })

  const onClick = async (e) => {
    Utils.clickEffect(e)
    await tryToStartPomodoro()
    getPomodoroStatus()
  }

  return (
    <DataWidget.Widget {...{classes, onClick}} disableSlider>
			{!isStopped && <Icons.Playing />}
      {statusText}
    </DataWidget.Widget>
  )
}
