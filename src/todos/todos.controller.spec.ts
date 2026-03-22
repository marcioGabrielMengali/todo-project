import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

const mockTodo: Todo = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const mockTodosService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TodosController', () => {
  let controller: TodosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return a todo', async () => {
      const dto: CreateTodoDto = { title: 'Test Todo', description: 'Test Description' };
      mockTodosService.create.mockResolvedValue(mockTodo);

      const result = await controller.create(dto);

      expect(mockTodosService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTodo);
    });

    it('should propagate service errors', async () => {
      const dto: CreateTodoDto = { title: 'Test Todo' };
      mockTodosService.create.mockRejectedValue(new Error('DB error'));

      await expect(controller.create(dto)).rejects.toThrow('DB error');
    });
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      mockTodosService.findAll.mockResolvedValue([mockTodo]);

      const result = await controller.findAll();

      expect(mockTodosService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockTodo]);
    });

    it('should return an empty array when there are no todos', async () => {
      mockTodosService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a single todo', async () => {
      mockTodosService.findOne.mockResolvedValue(mockTodo);

      const result = await controller.findOne(mockTodo.id);

      expect(mockTodosService.findOne).toHaveBeenCalledWith(mockTodo.id);
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException when todo is not found', async () => {
      mockTodosService.findOne.mockRejectedValue(
        new NotFoundException(`Todo with id "non-existent-id" not found`),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the todo', async () => {
      const dto: UpdateTodoDto = { title: 'Updated Title', completed: true };
      const updatedTodo = { ...mockTodo, ...dto };
      mockTodosService.update.mockResolvedValue(updatedTodo);

      const result = await controller.update(mockTodo.id, dto);

      expect(mockTodosService.update).toHaveBeenCalledWith(mockTodo.id, dto);
      expect(result).toEqual(updatedTodo);
    });

    it('should throw NotFoundException when todo to update is not found', async () => {
      mockTodosService.update.mockRejectedValue(
        new NotFoundException(`Todo with id "non-existent-id" not found`),
      );

      await expect(controller.update('non-existent-id', { title: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should remove the todo and return undefined', async () => {
      mockTodosService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockTodo.id);

      expect(mockTodosService.remove).toHaveBeenCalledWith(mockTodo.id);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when todo to remove is not found', async () => {
      mockTodosService.remove.mockRejectedValue(
        new NotFoundException(`Todo with id "non-existent-id" not found`),
      );

      await expect(controller.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
