import { Injectable } from '@nestjs/common';
import * as Dropbox from 'dropbox';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DropboxService {
  private readonly dropboxClient: Dropbox.Dropbox;

  constructor() {
    this.dropboxClient = new Dropbox.Dropbox({ accessToken: 'DROPBOX ACCESS TOKEN' });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = path.basename(file.originalname);
      const response=await this.dropboxClient.filesUpload({ path: `/${fileName}`, contents: file.buffer });
      console.log(response);
      return `File ${fileName} uploaded to Dropbox successfully`;
    } catch (error) {
      console.error('Error uploading file to Dropbox:', error);
      throw error;
    }
  }

  async downloadFile(dropboxPath: string, localPath: string): Promise<string> {
    try {
      const response = await this.dropboxClient.filesDownload({ path: dropboxPath });
      const fileContent = response.result as unknown as Buffer; 
      fs.writeFileSync(localPath, fileContent);
      return `File downloaded from Dropbox to ${localPath} successfully`;
    } catch (error) {
      console.error('Error downloading file from Dropbox:', error);
      throw error;
    }
  }

  async listFilesInDirectory(directoryPath: string): Promise<string[]> {
    try {
      const response = await this.dropboxClient.filesListFolder({ path: directoryPath });
      const files = response.result.entries;
      const filePaths = files.map((file: any) => file.path_display);
      return filePaths;
    } catch (error) {
      console.error('Error listing files in directory:', error);
      throw error;
    }
  }
  
}
