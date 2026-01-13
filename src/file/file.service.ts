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

  /**
   * Rename file .siq → .zip
   * Return new path
   */
  async renameSqiToZip(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();
    const workDir = path.join(process.cwd(), 'tmp');
    const fileName = path.basename(filePath, ext);

    if (ext !== '.siq') {
      throw new Error(`Invalid file type: expected .siq, got ${ext}`);
    }

    const newPath = path.join(workDir, `${fileName}.zip`);

    await fs.copyFile(filePath, newPath);

    return newPath;
  }

  async processFile(filePath: string): Promise<string> {
    const baseName = path.basename(filePath);
    const exampleSiq = path.join(process.cwd(), 'example', baseName);
    const workDir = path.join(process.cwd(), 'tmp');
    await fs.ensureDir(workDir);

    const renamedFile = await this.renameSqiToZip(exampleSiq);
    console.log('renamedFile = ', renamedFile);

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
