import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const mockTodo: Todo = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const mockTodoRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
};

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return a todo', async () => {
      const dto: CreateTodoDto = { title: 'Test Todo', description: 'Test Description' };

      mockTodoRepository.create.mockReturnValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue(mockTodo);

      const result = await service.create(dto);

      expect(mockTodoRepository.create).toHaveBeenCalledWith({
        ...dto,
        completed: false,
      });
      expect(mockTodoRepository.save).toHaveBeenCalledWith(mockTodo);
      expect(result).toEqual(mockTodo);
    });

    it('should default completed to false when not provided', async () => {
      const dto: CreateTodoDto = { title: 'No completed field' };

      mockTodoRepository.create.mockReturnValue({ ...mockTodo, completed: false });
      mockTodoRepository.save.mockResolvedValue({ ...mockTodo, completed: false });

      const result = await service.create(dto);

      expect(mockTodoRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ completed: false }),
      );
      expect(result.completed).toBe(false);
    });

    it('should respect completed=true when provided', async () => {
      const dto: CreateTodoDto = { title: 'Done', completed: true };
      const doneTodo = { ...mockTodo, completed: true };

      mockTodoRepository.create.mockReturnValue(doneTodo);
      mockTodoRepository.save.mockResolvedValue(doneTodo);

      const result = await service.create(dto);
      expect(result.completed).toBe(true);
    });
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      mockTodoRepository.find.mockResolvedValue([mockTodo]);

      const result = await service.findAll();

      expect(mockTodoRepository.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
      expect(result).toEqual([mockTodo]);
    });

    it('should return an empty array when no todos exist', async () => {
      mockTodoRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      mockTodoRepository.findOne.mockResolvedValue(mockTodo);

      const result = await service.findOne(mockTodo.id);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTodo.id } });
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException when todo does not exist', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Todo with id "non-existent-id" not found',
      );
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the todo', async () => {
      const dto: UpdateTodoDto = { title: 'Updated Title', completed: true };
      const updatedTodo = { ...mockTodo, ...dto };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoRepository.merge.mockReturnValue(updatedTodo);
      mockTodoRepository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(mockTodo.id, dto);

      expect(mockTodoRepository.merge).toHaveBeenCalledWith(mockTodo, dto);
      expect(mockTodoRepository.save).toHaveBeenCalledWith(updatedTodo);
      expect(result).toEqual(updatedTodo);
    });

    it('should throw NotFoundException when updating a non-existent todo', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent-id', { title: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should remove the todo', async () => {
      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoRepository.remove.mockResolvedValue(undefined);

      await service.remove(mockTodo.id);

      expect(mockTodoRepository.remove).toHaveBeenCalledWith(mockTodo);
    });

    it('should throw NotFoundException when removing a non-existent todo', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
