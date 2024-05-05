import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DropboxController } from './controllers/dropbox.controller';
import { DropboxService } from './services/dropbox.service';

@Module({
  imports: [],
  controllers: [AppController, DropboxController],
  providers: [AppService, DropboxService],
})
export class AppModule {}
