import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UserData } from 'src/decorator/request.decorator';
import { ResumeDto } from './dto/resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { UploadService } from 'src/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('resumes')
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@UserData('userID') userID: string, @Req() req) {
    // Accessing files from the request
    let url = null;
    const file: Express.Multer.File = req.file;
    if (file) {
      const response = await this.uploadService.uploadToS3(file);
      url = response.url;
    }
    url = url ? url : '';
    const data = JSON.parse(req.body.data);
    const resumeDto: ResumeDto = data;
    const createResumeDto: CreateResumeDto = {
      ...resumeDto,
      userId: userID,
      thumbnail: url,
    };
    return this.resumesService.create(createResumeDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UserData('userID') userId: string,
    @Param('id') id: string,
    @Req() req,
  ): Promise<any> {
    // Accessing files from the request
    let url = null;
    const file: Express.Multer.File = req.file;
    if (file) {
      const response = await this.uploadService.uploadToS3(file);
      url = response.url;
    }

    const data = JSON.parse(req.body.data);
    const updateResumeDto: UpdateResumeDto = data;
    if (url) {
      updateResumeDto['thumbnail'] = url;
    }

    return this.resumesService.update(id, userId, updateResumeDto);
  }

  @Get(':id')
  getResume(
    @UserData('userID') userId: string,
    @Param('id') id: string,
  ): Promise<any> {
    return this.resumesService.getResume(id, userId);
  }

  @Get('user/all')
  findByUserId(@UserData('userID') userID: string) {
    return this.resumesService.findByUserId(userID);
  }

  @Get()
  findAll(@UserData('userID') userID: string): Promise<any> {
    return this.resumesService.findAll(userID);
  }
}
