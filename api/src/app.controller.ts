import { Controller, Get, Post, UseInterceptors, UploadedFiles, Res, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth/auth.guard';

const multer = require('multer');
const path = require('path');
const logos = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'logos/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const imgPublicidad = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'publicidades/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const pdf = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'pdfs/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadLogos = multer({
  storage: logos
})

const uploadPublicidades = multer({
  storage: imgPublicidad
})

const uploadPdf = multer({
  storage: pdf
})

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/uploads/logos')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FilesInterceptor('image', 1, uploadLogos)
  )
  uploadLogo(@UploadedFiles() image) {
  }

  @Post('/uploads/publicidades')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FilesInterceptor('image', 1, uploadPublicidades))
  uploadPublicidad(@UploadedFiles() image) {
  }

  @Post('/uploads/pdfs')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FilesInterceptor('file', 1, uploadPdf)
  )
  uploadPdf(@UploadedFiles() file) {
  }

  @Get('/images/logos/:imgpath')
  @UseGuards(new AuthGuard())
  seeLogos(@Param('imgpath') logo, @Res() res) {
    return res.sendFile(logo, { root: './logos' })
  }

  @Get('/images/publicidades/:imgpath')
  @UseGuards(new AuthGuard())
  seePublicidades(@Param('imgpath') publicidad, @Res() res) {
    return res.sendFile(publicidad, { root: './publicidades' })
  }

  @Get('/pdfs/:pdfpath')
  @UseGuards(new AuthGuard())
  seePdfs(@Param('pdfpath') pdf, @Res() res) {
    return res.sendFile(pdf, { root: './pdfs' })
  }

}
