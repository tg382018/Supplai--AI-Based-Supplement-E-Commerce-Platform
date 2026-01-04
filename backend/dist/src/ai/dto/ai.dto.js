"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatMessageDto = exports.AiRecommendationDto = exports.Goal = exports.ActivityLevel = exports.Gender = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var ActivityLevel;
(function (ActivityLevel) {
    ActivityLevel["SEDENTARY"] = "sedentary";
    ActivityLevel["LIGHT"] = "light";
    ActivityLevel["MODERATE"] = "moderate";
    ActivityLevel["ACTIVE"] = "active";
    ActivityLevel["VERY_ACTIVE"] = "very_active";
})(ActivityLevel || (exports.ActivityLevel = ActivityLevel = {}));
var Goal;
(function (Goal) {
    Goal["WEIGHT_LOSS"] = "weight_loss";
    Goal["MUSCLE_GAIN"] = "muscle_gain";
    Goal["ENERGY"] = "energy";
    Goal["IMMUNITY"] = "immunity";
    Goal["SLEEP"] = "sleep";
    Goal["STRESS"] = "stress";
    Goal["DIGESTION"] = "digestion";
    Goal["SKIN_HEALTH"] = "skin_health";
    Goal["JOINT_HEALTH"] = "joint_health";
    Goal["HEART_HEALTH"] = "heart_health";
    Goal["BRAIN_HEALTH"] = "brain_health";
    Goal["GENERAL_WELLNESS"] = "general_wellness";
})(Goal || (exports.Goal = Goal = {}));
class AiRecommendationDto {
    age;
    gender;
    weight;
    height;
    goals;
    healthConditions;
    dietType;
    activityLevel;
    description;
}
exports.AiRecommendationDto = AiRecommendationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AiRecommendationDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: Gender }),
    (0, class_validator_1.IsEnum)(Gender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AiRecommendationDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 75 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(300),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AiRecommendationDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 175 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(250),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AiRecommendationDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: Goal, isArray: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(Goal, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AiRecommendationDto.prototype, "goals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['diabetes', 'high_blood_pressure'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AiRecommendationDto.prototype, "healthConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'vegetarian' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AiRecommendationDto.prototype, "dietType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ActivityLevel }),
    (0, class_validator_1.IsEnum)(ActivityLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AiRecommendationDto.prototype, "activityLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '25 yaşındayım, 80 kiloyum, zayıflamak istiyorum ve enerjim düşük' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AiRecommendationDto.prototype, "description", void 0);
class AiChatMessageDto {
    message;
    sessionId;
}
exports.AiChatMessageDto = AiChatMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What supplements do you recommend for energy?' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AiChatMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AiChatMessageDto.prototype, "sessionId", void 0);
//# sourceMappingURL=ai.dto.js.map