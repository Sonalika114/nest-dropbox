import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { DropboxService } from '../services/dropbox.service';


@Controller('files')
export class DropboxController {
  constructor(private readonly dropboxService: DropboxService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any): Promise<string> {
    console.log('Uploaded file:', file); 
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
  
    return this.dropboxService.uploadFile(file);
  }

  @Get('download/:dropboxPath') // Import Get decorator
  async downloadFile(@Param('dropboxPath') dropboxPath: string, @Res() res: any): Promise<void> { 
    try {
      const localPath = `./downloads/${Date.now()}_${path.basename(dropboxPath)}`;
      dropboxPath="/"+dropboxPath;
      const message = await this.dropboxService.downloadFile(dropboxPath, localPath);
      
      res.download(localPath, (err: any) => {
        if (err) {
          console.error('Error downloading file:', err);
          throw err;
        }
        fs.unlinkSync(localPath); 
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  @Get('list')
  async listFiles(): Promise<string[]> {
    const directoryPath = ''; 
    return this.dropboxService.listFilesInDirectory(directoryPath);
  }
}
