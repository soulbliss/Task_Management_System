type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  level: LogLevel;
  message: string;
  module: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(logData: LogMessage): string {
    const timestamp = new Date().toISOString();
    const { level, message, module, data } = logData;
    
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] [${module}] ${message}`;
    if (data) {
      logMessage += '\nData: ' + JSON.stringify(data, null, 2);
    }
    return logMessage;
  }

  private log(logData: LogMessage): void {
    const formattedMessage = this.formatMessage(logData);

    switch (logData.level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  public debug(module: string, message: string, data?: any): void {
    this.log({ level: 'debug', message, module, timestamp: new Date().toISOString(), data });
  }

  public info(module: string, message: string, data?: any): void {
    this.log({ level: 'info', message, module, timestamp: new Date().toISOString(), data });
  }

  public warn(module: string, message: string, data?: any): void {
    this.log({ level: 'warn', message, module, timestamp: new Date().toISOString(), data });
  }

  public error(module: string, message: string, data?: any): void {
    this.log({ level: 'error', message, module, timestamp: new Date().toISOString(), data });
  }
}

export const logger = Logger.getInstance(); 