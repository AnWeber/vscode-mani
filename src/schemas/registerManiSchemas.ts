import * as vscode from "vscode";

import { logError } from "../initOutputChannel";
import { ManiConfigFiles } from "../mani";
import schema from "./mani-schemas.json";

const SchemaName = "mani";

export async function registerManiSchemas(): Promise<void> {
  try {
    const yamlExtension = await vscode.extensions.getExtension(
      "redhat.vscode-yaml"
    );
    if (yamlExtension && !yamlExtension?.isActive) {
      await yamlExtension.activate();
    }

    yamlExtension?.exports.registerContributor(
      SchemaName,
      onRequestSchemaURI,
      onRequestSchemaContent
    );
  } catch (err) {
    logError("yaml Registration did throw");
    logError(err);
  }
}
function onRequestSchemaURI(resource: string): string | undefined {
  if (ManiConfigFiles?.some((c) => resource.endsWith(c))) {
    return `${SchemaName}://schemas/config`;
  }
  return undefined;
}

function onRequestSchemaContent(schemaUri: string): string | undefined {
  const parsedUri = vscode.Uri.parse(schemaUri);
  if (parsedUri.scheme !== SchemaName) {
    return undefined;
  }
  if (!parsedUri.path || !parsedUri.path.startsWith("/")) {
    return undefined;
  }

  return JSON.stringify(schema);
}
