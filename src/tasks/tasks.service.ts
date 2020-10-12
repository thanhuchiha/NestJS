import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import {v4 as uuid}  from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[]{
        return this.tasks;
    }

    getTaskWithFilters(filterDto: GetTaskFilterDto): Task[]{
        const {status, search} = filterDto;
        let tasks = this.getAllTasks();

        if(status){
            tasks = tasks.filter(task => task.status === status);
        }

        if(search){
            tasks = tasks.filter(task => 
                task.title.includes(search) ||
                task.description.includes(search)
            );
        }
        return tasks;
    }

    getTaskById(id: string): Task{
        const found =  this.tasks.find(task => task.id == id);3

        if(!found){
            throw new NotFoundException(`Task with ID ${id} not found !`);
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task{
        const {title, description} = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void{
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id != id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task{
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
