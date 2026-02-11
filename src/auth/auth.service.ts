import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DbService } from "src/db/db.service";
import * as bcrypt from 'bcrypt';

@Injectable()

export class AuthService {
    constructor(private db: DbService, private jwtService: JwtService,){}

    async login(email: string, password: string){
        const sql = 'SELECT * FROM usuarios WHERE email = $1';
        const users = await this.db.query(sql, [email]);

        const user = users[0];

        if(!user){
            throw new UnauthorizedException("Usuario no encontrado");
        }

        const passwordValid = await bcrypt.compare(password,user.contrasena);

        if (!passwordValid) {
            throw new UnauthorizedException("Contraseña incorrecta");
        }

        const payload = {
            sub: user.id,
            email: user.email,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}