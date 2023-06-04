import { Get, Render } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { version } from '../package.json';
@ApiTags('Apresentação')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'Tela de apresentação da documentação' })
  @Get()
  @Render('index')
  root() {
    return { version };
  }
}
