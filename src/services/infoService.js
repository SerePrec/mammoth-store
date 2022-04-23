import config from "../config.js";

class InfoService {
  getServerInfo = () => ({
    SO: process.platform,
    CPUs: config.numCPUs,
    nodeVersion: process.version,
    execPath: process.execPath,
    proyectPath: process.cwd(),
    viewsPath: config.viewsPath,
    staticsPath: config.staticsPath,
    productsPath: config.uploadsImg.productsPath,
    avatarsPath: config.uploadsImg.avatarsPath,
    logsPath: config.logsFolder,
    pid: process.pid,
    rss: Math.round(process.memoryUsage().rss / 1024),
    args:
      process.argv.length > 2 ? process.argv.slice(2).join(", ") : "ninguno",
    enviroment: config.NODE_ENV,
    mode: config.MODE,
    port: config.PORT,
    pers: config.PERS,
    sessionStore: "MongoDB",
    sessionAge: config.session.options.cookie.maxAge,
    rolling: config.session.options.rolling,
    adminEmail: config.email.adminEmail,
    adminWsp: config.twilio.adminWsp,
    smsPhoneNumber: config.twilio.smsPhoneNumber,
    wspPhoneNumber: config.twilio.wspPhoneNumber
  });
}

export default InfoService;
