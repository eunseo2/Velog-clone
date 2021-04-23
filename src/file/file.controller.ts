import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/lib/editFileName';
import { imageFileFilter } from 'src/lib/imageFileFilter';
import config from '../config';

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };

      response.push(fileReponse);
    });
    return response;
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image) {
    const API_HOST = config.API_HOST;
    return `${API_HOST}/files/${image}`;
  }
}
