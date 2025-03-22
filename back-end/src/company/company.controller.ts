import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/types/TokenPayload';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@User() user: TokenPayload, @Body() body: CompanyDto) {
    return this.companyService.create(user.sub, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('join')
  async joinCompany(@User() dto: TokenPayload, @Body() body: { code: string }) {
    return this.companyService.join(dto.sub, body.code);
  }
}
