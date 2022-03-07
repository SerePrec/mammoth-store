import os from "os";
import parseArgs from "minimist";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = parseArgs(process.argv.slice(2), {
  alias: { p: ["PORT", "port"], m: ["mode", "MODE"] },
  default: { p: 8080, m: "FORK" }
});

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV !== "production") {
  const { config } = await import("dotenv");
  config();
}

const config = {
  NODE_ENV,
  PORT: process.env.PORT || Number(argv.PORT) || 8080,
  MODE: process.env.MODE || argv.MODE || "FORK",
  numCPUs: os.cpus().length,
  PERS: process.env.PERS || "mem",
  uploadsImg: {
    productsPath: path.join(__dirname, "public", "img", "productos"),
    avatarsPath: path.join(__dirname, "public", "img", "avatars")
  },
  fileSystemDb: {
    path: path.join(__dirname, "..", "DB"),
    messagesFile: "mensajes.json",
    productsFile: "productos.json",
    cartsFile: "carritos.json",
    ordersFile: "ordenes.json",
    usersFile: "usuarios.json"
  },
  mariaDb: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: process.env.MARIADB_USER || "root",
      password: process.env.MARIADB_PWD || "",
      database: process.env.MARIADB_DB || "test",

      charset: "utf8mb4"
    }
  },
  clearDb: {
    client: "mysql",
    connection: {
      host: process.env.CLEARDB_HOST,
      user: process.env.CLEARDB_USER,
      password: process.env.CLEARDB_PWD,
      database: process.env.CLEARDB_DB,
      charset: "utf8mb4"
    }
  },
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "..", "DB", "ecommerce.sqlite")
    },
    useNullAsDefault: true
  },
  mongoDb: {
    connectionString: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true, //No necesario desde mongoose 6
      useUnifiedTopology: true, //No necesario desde mongoose 6
      serverSelectionTimeoutMS: 5000
    }
  },
  mongoDbAtlas: {
    connectionString: process.env.MONGODB_ATLAS_URI,
    options: {
      useNewUrlParser: true, //No necesario desde mongoose 6
      useUnifiedTopology: true, //No necesario desde mongoose 6
      serverSelectionTimeoutMS: 5000
    }
  },
  firebase: {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  },
  session: {
    mongoStoreOptions: {
      mongoUrl:
        process.env.PERS === "mongodb"
          ? process.env.MONGODB_URI
          : process.env.MONGODB_ATLAS_URI,
      mongoOptions:
        process.env.PERS === "mongodb"
          ? { useUnifiedTopology: true }
          : {
              useNewUrlParser: true,
              useUnifiedTopology: true
            }
    },
    options: {
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 10 * 60 * 1000
      }
    }
  },
  googleAuth: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CB_URL || "/auth/google/callback"
  },
  email: {
    nodemailer: {
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.GMAIL_MAMMOOTH,
        pass: process.env.GMAIL_MAMMOTH_PASS
      }
    },
    adminEmail: process.env.GMAIL_ADMIN
  },
  logsFolder: path.join(__dirname, "logs")
};

export default config;

console.dir(config, { depth: 10 });
