import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load YAML
const swaggerDocument = YAML.load(
  path.join(__dirname, "../../openapi.yaml")
);

// Serve Swagger UI
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;