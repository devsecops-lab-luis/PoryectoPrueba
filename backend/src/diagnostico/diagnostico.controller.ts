import { Controller, Get, Query } from '@nestjs/common';
import { execFileSync } from 'child_process';

@Controller('diagnostico')
export class DiagnosticoController {
  @Get('ping')
  ping(@Query('host') host: string) {
    if (!/^(?!-)[A-Za-z0-9:][A-Za-z0-9.:%-]*$/.test(host)) {
      throw new Error('Invalid host');
    }
    const resultado = execFileSync('ping', ['-c', '2', host]).toString();
    return { host, resultado };
  }
}