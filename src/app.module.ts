import { Module } from '@nestjs/common';
import { GuardModule } from '@libs/auth';
import { GracefulShutdownService } from '@libs/graceful-shutdown';
import { DatabaseModule } from '@libs/orm';
import { AppController } from './app.controller';
import { BookmarkModule } from './services/bookmarks';
import { UserModule, ProjectModule, AuthModule, StackModule } from './services';
import { ProfileModule } from './services/profiles';

@Module({
  imports: [
    DatabaseModule.manager(),
    ProjectModule,
    StackModule,
    UserModule,
    AuthModule,
    GuardModule,
    ProfileModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [GracefulShutdownService],
})
export class AppModule {}
