import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  async findAll() {
    return this.taskService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: TaskDto) {
    return this.taskService.create(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.taskService.deleteById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async toggleTask(@Param('id') id: string) {
    return this.taskService.toggleTask(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/name')
  @UsePipes(new ValidationPipe())
  async updateTask(@Param('id') id: string, @Body() taskData: TaskDto) {
    const { name, description } = taskData;
    return await this.taskService.updateTask(id, name, description);
  }
}
