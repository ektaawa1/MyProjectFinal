import winston, {format, transports} from 'winston';
import { DateTime } from 'luxon';


const logFormat = format.printf(({level, message}) => {

    const dateFormat = DateTime.now().toUTC() //or ISO()
    return `{time: ${dateFormat} level: ${level} message: ${message}}`
})

export const getLoggerInstance = () => {
    const logger = winston.createLogger({
        level: 'info', //info, warn, error, debug
        format: format.json(),
        transports:
        [
            new transports.Console({format: format.combine(format.colorize(), logFormat)})
        ]
    })

    return logger
}