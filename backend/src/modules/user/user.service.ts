import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(user_id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_id } });
  }

  async update(user_id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(user_id, updateData);
    return this.findById(user_id);
  }
}
