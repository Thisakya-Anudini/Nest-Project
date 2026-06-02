import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function bootstrap() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || '', {
      dbName: 'task',
    });
    console.log('Database connected successfully');

    // Start the server
    const app = await NestFactory.create(AppModule, { logger: false });

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

bootstrap();
