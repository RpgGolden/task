import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    public readonly taskRepository: Repository<TaskEntity>,
  ) {}

  findAll(): Promise<TaskEntity[]> {
    return this.taskRepository.find();
  }

  findOne(id: string): Promise<TaskEntity | null> {
    return this.taskRepository.findOneBy({ id });
  }

  async deleteById(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async create(dto: TaskDto): Promise<TaskEntity> {
    const newTask = this.taskRepository.create(dto);

    return await this.taskRepository.save(newTask);
  }

  async toggleTask(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOneByOrFail({ id });
    if (task) {
      task.isDone = !task.isDone;
      await this.taskRepository.save(task);
      return task;
    } else {
      throw new Error('Task not found');
    }
  }
  async updateTask(
    id: string,
    newName: string,
    newDescription: string,
  ): Promise<TaskEntity | null> {
    const task = await this.findOne(id);

    task.name = newName;
    task.description = newDescription;
    return await this.taskRepository.save(task);
  }
}
