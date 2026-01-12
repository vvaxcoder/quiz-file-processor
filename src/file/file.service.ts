import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class FileService {
  async readFile(filePath: string): Promise<Buffer> {
    if (!(await fs.pathExists(filePath))) {
      throw new Error(`File not found: ${filePath}`);
    }

    return fs.readFile(filePath);
  }

  async processFile(filePath: string): Promise<string> {
    const baseName = path.basename(filePath);
    const workDir = path.join(process.cwd(), 'tmp');
    await fs.ensureDir(workDir);

    // const zipPath = path.join(workDir, `${baseName}.zip`);
    // const extractedDir = path.join(workDir, 'unzipped');
    const jsonOutput = path.join(workDir, `${path.parse(baseName).name}.json`);

    // const buffer = await this.readFile(filePath);
    // await this.zipFile(buffer, baseName, zipPath);
    // const extractedFile = await this.unzipFile(zipPath, extractedDir);
    // const jsonData = await this.parseXmlToJson(extractedFile);
    // await this.writeJson(jsonData, jsonOutput);

    return jsonOutput;
  }
}
