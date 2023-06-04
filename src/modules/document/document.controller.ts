import { Controller, Get, Param } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Documentos')
@Controller('api/v1/documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  @ApiOperation({ summary: 'Verificar cnpj' })
  @ApiResponse({ status: 200, description: 'Verificação do status do cnpj' })
  @ApiParam({ name: 'cnpj', description: 'Número do cnpj', example: '10.190.614/0001-37' })
  @Throttle(3, 60)
  @Get('cnpj/:cnpj')
  checkCNPJ(@Param('cnpj') cnpj: string) {
    return this.documentService.checkCNPJ(cnpj);
  }
}
