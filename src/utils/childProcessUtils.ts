import { ExecOptions, exec } from "child_process";

export async function runShell(
  command: string,
  options: ExecOptions
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(command, options, function (err, stdout, stderr) {
      if (err != null) {
        reject(err);
      } else if (typeof stderr != "string") {
        return reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
}
