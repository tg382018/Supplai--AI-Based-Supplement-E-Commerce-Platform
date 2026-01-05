import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../auth';

@Controller('api/addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Post()
    create(@Request() req, @Body() data: any) {
        return this.addressesService.create(req.user.userId, data);
    }

    @Get()
    findAll(@Request() req) {
        return this.addressesService.findAll(req.user.userId);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.addressesService.remove(req.user.userId, id);
    }
}
