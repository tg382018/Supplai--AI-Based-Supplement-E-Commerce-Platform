import { IsString, IsNumber, IsArray, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum ActivityLevel {
    SEDENTARY = 'sedentary',
    LIGHT = 'light',
    MODERATE = 'moderate',
    ACTIVE = 'active',
    VERY_ACTIVE = 'very_active',
}

export enum Goal {
    WEIGHT_LOSS = 'weight_loss',
    MUSCLE_GAIN = 'muscle_gain',
    ENERGY = 'energy',
    IMMUNITY = 'immunity',
    SLEEP = 'sleep',
    STRESS = 'stress',
    DIGESTION = 'digestion',
    SKIN_HEALTH = 'skin_health',
    JOINT_HEALTH = 'joint_health',
    HEART_HEALTH = 'heart_health',
    BRAIN_HEALTH = 'brain_health',
    GENERAL_WELLNESS = 'general_wellness',
}

export class AiRecommendationDto {
    @ApiPropertyOptional({ example: 25 })
    @IsNumber()
    @Min(18)
    @Max(100)
    @Type(() => Number)
    @IsOptional()
    age?: number;

    @ApiPropertyOptional({ enum: Gender })
    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @ApiPropertyOptional({ example: 75 })
    @IsNumber()
    @Min(30)
    @Max(300)
    @Type(() => Number)
    @IsOptional()
    weight?: number;

    @ApiPropertyOptional({ example: 175 })
    @IsNumber()
    @Min(100)
    @Max(250)
    @Type(() => Number)
    @IsOptional()
    height?: number;

    @ApiPropertyOptional({ enum: Goal, isArray: true })
    @IsArray()
    @IsEnum(Goal, { each: true })
    @IsOptional()
    goals?: Goal[];

    @ApiPropertyOptional({ example: ['diabetes', 'high_blood_pressure'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    healthConditions?: string[];

    @ApiPropertyOptional({ example: 'vegetarian' })
    @IsString()
    @IsOptional()
    dietType?: string;

    @ApiPropertyOptional({ enum: ActivityLevel })
    @IsEnum(ActivityLevel)
    @IsOptional()
    activityLevel?: ActivityLevel;

    @ApiProperty({ example: '25 yaşındayım, 80 kiloyum, zayıflamak istiyorum ve enerjim düşük' })
    @IsString()
    description: string;
}

export class AiChatMessageDto {
    @ApiProperty({ example: 'What supplements do you recommend for energy?' })
    @IsString()
    message: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    sessionId?: string;
}
