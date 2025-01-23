class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  formatError(error) {
    if (error instanceof Error) {
      return this.isDevelopment ? error.stack || error.message : error.message;
    }
    return String(error);
  }

  log(level, context, message, data) {
    const logMessage = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      data: data ? (typeof data === 'object' ? data : this.formatError(data)) : undefined
    };

    if (this.isDevelopment) {
      console.log(JSON.stringify(logMessage, null, 2));
    } else {
      // In production, use a more compact format
      const { timestamp, level, context: ctx, message: msg, data: details } = logMessage;
      console.log(`${timestamp} ${level.toUpperCase()} [${ctx}] ${msg}${details ? ` - ${JSON.stringify(details)}` : ''}`);
    }
  }

  debug(context, message, data) {
    this.log('debug', context, message, data);
  }

  info(context, message, data) {
    this.log('info', context, message, data);
  }

  warn(context, message, data) {
    this.log('warn', context, message, data);
  }

  error(context, message, data) {
    this.log('error', context, message, data);
  }
}

export const logger = new Logger(); 