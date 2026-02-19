import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt.guard";
import { DbService } from "src/db/db.service";
import { UsuariosService } from "src/usuarios/usuarios.service";



@Module({
    imports:[ JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '1h'},
    })],
    controllers:[AuthController],
    providers:[AuthService,
        JwtStrategy,
        JwtAuthGuard,
        DbService,
        UsuariosService,
    ],
    exports: [AuthService, JwtAuthGuard]
})

export class AuthModule {}