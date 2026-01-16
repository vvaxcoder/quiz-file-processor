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
