import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class AuthService {
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });
  }

  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findUserById(id) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async updateRefreshToken(userId, refreshToken) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });
  }

  async removeRefreshToken(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
  }
}

export default new AuthService();
