import { Controller, Get, Query } from '@nestjs/common';
import { execSync } from 'child_process';

@Controller('diagnostico')
export class DiagnosticoController {
  @Get('ping')
  ping(@Query('host') host: string) {
    const resultado = execSync('ping -c 2 ' + host).toString();
    return { host, resultado };
  }
}