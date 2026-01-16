import { Injectable } from '@nestjs/common';
import AdmZip from 'adm-zip';
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

  /**
   * Unzip .zip -> to same folder
   * Return unzipped folder
   */
  async unzipFile(zipPath: string, destDir: string): Promise<string> {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(destDir, true);
    const files = await fs.readdir(destDir);
    return path.join(destDir, files[0]);
  }

  // async parseXmlToJson(filePath: string): Promise<any> {
  //   const xmlData = await fs.readFile(filePath, 'utf-8');
  //   const parser = new XMLParser({ ignoreAttributes: false });
  //   return parser.parse(xmlData);
  // }

  // async writeJson(data: any, outputPath: string): Promise<void> {
  //   await fs.writeJson(outputPath, data, { spaces: 2 });
  // }

  async processFile(filePath: string): Promise<string> {
    const baseName = path.basename(filePath);
    const exampleSiq = path.join(process.cwd(), 'example', baseName);
    const workDir = path.join(process.cwd(), 'tmp');
    await fs.ensureDir(workDir);
    const renamedFile = await this.renameSqiToZip(exampleSiq);
    const jsonOutput = path.join(workDir, `${path.parse(baseName).name}.json`);
    const extractedFile = await this.unzipFile(renamedFile, workDir);
    console.log('extractedFile = ', extractedFile);
    // const jsonData = await this.parseXmlToJson(extractedFile);
    // await this.writeJson(jsonData, jsonOutput);

    return jsonOutput;
  }
}
