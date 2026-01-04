export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum ActivityLevel {
    SEDENTARY = "sedentary",
    LIGHT = "light",
    MODERATE = "moderate",
    ACTIVE = "active",
    VERY_ACTIVE = "very_active"
}
export declare enum Goal {
    WEIGHT_LOSS = "weight_loss",
    MUSCLE_GAIN = "muscle_gain",
    ENERGY = "energy",
    IMMUNITY = "immunity",
    SLEEP = "sleep",
    STRESS = "stress",
    DIGESTION = "digestion",
    SKIN_HEALTH = "skin_health",
    JOINT_HEALTH = "joint_health",
    HEART_HEALTH = "heart_health",
    BRAIN_HEALTH = "brain_health",
    GENERAL_WELLNESS = "general_wellness"
}
export declare class AiRecommendationDto {
    age?: number;
    gender?: Gender;
    weight?: number;
    height?: number;
    goals?: Goal[];
    healthConditions?: string[];
    dietType?: string;
    activityLevel?: ActivityLevel;
    description: string;
}
export declare class AiChatMessageDto {
    message: string;
    sessionId?: string;
}
