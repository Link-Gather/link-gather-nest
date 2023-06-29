import { Controller, Get, Injectable, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClickParamDto, ListResponseDto } from '../dto';
import { AuthGuard } from '../../../libs/auth/guard';
import { BookmarkService } from '../application/service';

@Controller('bookmarks')
@ApiTags('Bookmark')
@Injectable()
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '유저 북마크 목록 API', description: '로그인한 유저의 북마크 목록을 리턴한다.' })
  async list(@Req() req: Request): Result<ListResponseDto[]> {
    const { user } = req.state;
    const bookmarks = await this.bookmarkService.list({ user });

    const data = bookmarks.map((bookmark) => new ListResponseDto(bookmark));
    return { data };
  }

  @Post('/:projectId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '북마크 추가/삭제 API',
    description: '북마크 하지 않은 프로젝트의 북마크 클릭: 북마크 추가, 북마크한 프로젝트의 북마크 클릭: 북마크 삭제',
  })
  async click(@Param() param: ClickParamDto, @Req() req: Request): Promise<void> {
    const { user } = req.state;
    const { projectId } = param;
    await this.bookmarkService.click({ user }, projectId);
  }
}
