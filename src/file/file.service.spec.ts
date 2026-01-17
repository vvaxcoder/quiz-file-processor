import AdmZip from 'adm-zip';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs-extra';
import * as path from 'path';
import { FileService } from './file.service';

describe('Test FileService', () => {
  let service: FileService;
  const testDir = path.join(process.cwd(), 'test_tmp');
  const tmpDir = path.join(process.cwd(), 'tmp');

  beforeAll(async () => {
    await fs.ensureDir(testDir);
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  afterAll(async () => {
    await fs.remove(testDir);
  });

  it('should rename .siq to .zip', async () => {
    const oldPath = path.join(testDir, 'test.siq');
    await fs.writeFile(oldPath, 'dummy');

    const renamed = await service.renameSqiToZip(oldPath);
    const expectedNewPath = path.join(tmpDir, 'test.zip');

    expect(renamed).toBe(expectedNewPath);
    expect(await fs.pathExists(expectedNewPath)).toBe(true);
  });

  it('should call unzipFile .zip to same folder', async () => {});
});

describe('FileService - unzipFile', () => {
  let service: FileService;
  const testDir = path.join(process.cwd(), 'test_tmp');
  const zipPath = path.join(testDir, 'archive.zip');
  const unzipDir = path.join(testDir, 'unzipped');

  beforeAll(async () => {
    await fs.ensureDir(testDir);

    // создаём zip-архив с тестовым файлом
    const sampleFilePath = path.join(testDir, 'sample.txt');
    await fs.writeFile(sampleFilePath, 'hello world');
    const zip = new AdmZip();
    zip.addLocalFile(sampleFilePath);
    zip.writeZip(zipPath);

    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();
    service = module.get<FileService>(FileService);
  });

  afterAll(async () => {
    await fs.remove(testDir);
  });

  it('should unzip existing zip file to destination', async () => {
    const result = await service.unzipFile(zipPath, unzipDir);

    // Проверяем, что результат — корректный путь
    expect(result).toContain(unzipDir);

    // Проверяем, что в папке действительно появился файл
    const files = await fs.readdir(unzipDir);
    expect(files.length).toBeGreaterThan(0);

    const extractedFilePath = path.join(unzipDir, files[0]);
    const content = await fs.readFile(extractedFilePath, 'utf-8');
    expect(content).toBe('hello world');
  });

  it('should throw an error if zip file does not exist', async () => {
    const fakeZip = path.join(testDir, 'nonexistent.zip');
    await expect(service.unzipFile(fakeZip, unzipDir)).rejects.toThrow(
      /Zip file not found/,
    );
  });
});
