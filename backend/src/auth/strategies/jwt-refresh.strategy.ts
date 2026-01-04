import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('jwt.refreshSecret') || 'fallback-refresh-secret',
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: { sub: string; email: string; role: string }) {
        const authHeader = req.get('Authorization');
        const refreshToken = authHeader ? authHeader.replace('Bearer ', '').trim() : '';
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            refreshToken,
        };
    }
}
