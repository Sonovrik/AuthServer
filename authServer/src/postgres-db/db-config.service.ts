import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';

@Injectable()
export class DbConfigService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_CONTAINER_PORT),
            username: process.env.POSTGRES_USER ?? '',
            password: process.env.POSTGRES_PASSWORD ?? '',
            database: process.env.POSTGRES_DB,
            synchronize: true,
            logging: true,
            entities: ['build/**/*.entity.{ts,js}'],
            migrationsTableName: 'migration',
            migrations: ['build/migration/**/*.{ts,js}'],
            subscribers: ['build/subscriber/**/*.{ts,js}'],
            cli: {
                entitiesDir: 'src/entity',
                migrationsDir: 'src/migration',
                subscribersDir: 'src/subscriber'
            },
            ssl: process.env.TYPEORM_SSL === 'true'
        };
    }
}

