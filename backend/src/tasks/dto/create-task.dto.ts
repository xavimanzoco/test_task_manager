import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min, IsInt } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsNumber()
  @Min(0)
  @IsOptional()
  effort_estimate?: number;

  @IsInt()
  @IsOptional()
  parent_id?: number;
}
