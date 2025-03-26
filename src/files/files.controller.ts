import {
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';

@ApiTags('Работа с файлами')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'Загрузка файлов' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), //10MB
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png|svg\+xml)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.filesService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }
}
