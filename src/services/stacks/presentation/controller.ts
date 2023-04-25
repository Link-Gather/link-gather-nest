import { ClassSerializerInterceptor, Controller, Get, Injectable, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StackService } from '../application/service';
import { ListResponseDto } from '../dto/get-dto';

@Controller('stacks')
@ApiTags('Stack')
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class StackController {
  constructor(private readonly stackService: StackService) {}

  @Get('/')
  @ApiOperation({
    summary: '기술스택 목록 API',
    description: '기술 스택 목록을 리턴한다.',
  })
  async list(): Result<ListResponseDto[]> {
    const stacks = await this.stackService.list();

    const data = stacks.map((stack) => new ListResponseDto(stack));
    return { data };
  }
}
