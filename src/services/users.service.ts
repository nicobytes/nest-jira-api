import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@db/entities/user.entity';
import { Role } from '@models/role.model';
import { CreateUserDto, UpdateUserDto } from '@dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findUserById(id: User['id']) {
    return this.usersRepo.findOneByOrFail({ id });
  }

  getAll() {
    return this.usersRepo.find();
  }

  findByEmail(email: string) {
    return this.usersRepo.findOneByOrFail({ email });
  }

  create(dto: CreateUserDto) {
    const user = this.usersRepo.create(dto);
    user.role = Role.ADMIN;
    return this.usersRepo.save(user);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findUserById(id);
    this.usersRepo.merge(user, changes);
    return this.usersRepo.save(user);
  }

  async delete(id: number) {
    const user = await this.findUserById(id);
    return this.usersRepo.remove(user);
  }
}
