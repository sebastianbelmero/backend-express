import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { JWTUtil } from "../utils/jwt.util";
import { compare, hash } from "bcrypt";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async register(data: RegisterInput) {
        console.log("AuthService.register called with data:", data);
        const existingUser = await this.userRepository.findOne({
            where: { email: data.email }
        });
        console.log("Existing user check:", existingUser);

        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await hash(data.password, 10);

        const user = this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword
        });

        await this.userRepository.save(user);

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: LoginInput) {
        const user = await this.userRepository.findOne({
            where: { email: data.email }
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const payload = { userId: user.id, email: user.email };
        const accessToken = JWTUtil.generateAccessToken(payload);
        const refreshToken = JWTUtil.generateRefreshToken(payload);

        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken
        };
    }

    async getUserById(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new Error("User not found");
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}