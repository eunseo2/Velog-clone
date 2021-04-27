import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/lib/editFileName';
import { imageFileFilter } from 'src/lib/imageFileFilter';
import config from '../config';
import { FileService } from './file.service';

type File = {
  originalname: string;
  filename: string;
};

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './static/files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(
    @Param('id') Id: number,
    @UploadedFiles() files,
  ): Promise<{ statusCode: number }> {
    const response = [];
    files.forEach(async (file: File) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
      await this.fileService.Update(Id, file.filename);
    });

    return { statusCode: 201 };
  }

  @Get(':id')
  async seeUploadedFile(@Param('id') Id: number) {
    const profile = await this.fileService.getFile(Id);
    return `${profile}`;
  }
}
